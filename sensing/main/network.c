#include "credentials.h"
#include "esp_interface.h"
#include "esp_log.h"
#include "esp_netif_ip_addr.h"
#include "esp_wifi.h"
#include "esp_wifi_types_generic.h"
#include "locals.h"
#include "lwip/sockets.h"
#include "nvs_flash.h"
#include "sensing.c"
#include "sntp.c"
#include "state.h"

int init_tcp_socket(char *host, int port) {
  ESP_LOGD(TAG, "setting up socket");
  int sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_IP);
  if (sockfd < 0) {
    ESP_LOGE(TAG, "unable to create socket: errno %d", errno);
    return -1;
  }
  const struct sockaddr_in server_addr = {.sin_addr.s_addr = inet_addr(host),
                                          .sin_family = AF_INET,
                                          .sin_port = htons(port)};
  ESP_LOGI(TAG, "socket created, connecting to %s:%d", host, port);
  int err =
      connect(sockfd, (struct sockaddr *)&server_addr, sizeof(struct sockaddr));
  if (err != 0) {
    ESP_LOGE(TAG, "socket unable to connect: errno %d", errno);
    close(sockfd);
    return -1;
  }
  ESP_LOGI(TAG, "connected");
  return sockfd;
}

void server_handshake(esp_ip4_addr_t *ip, int sockfd) {
  ESP_LOGI(TAG, "starting server handshake");
  char *payload = (char *)malloc(32 * sizeof(char));
  time_t now;
  time(&now);
  sprintf(payload, "%lli," IPSTR ",%s", now, IP2STR(ip), UNIT_NAME);
  ESP_LOGD(TAG, "server handshake sequence %s", payload);
  ssize_t send_result = send(sockfd, payload, strlen(payload), 0);
  if (send_result == -1) {
    ESP_LOGE(TAG, "error sending handshake data");
    set_status(ERROR);
  }
}

void wifi_event_handler(void *arg, esp_event_base_t event_base,
                        int32_t event_id, void *event_data) {
  ESP_LOGI(TAG, "event_base %s, evt %li", event_base, (long int)event_id);
  if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_START) {
    esp_wifi_connect();
    return;
  }

  if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_CONNECTED) {
    ESP_LOGI(TAG, "wifi connected");
  }

  if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {
    ESP_LOGI(TAG, "wifi disconnected");
    return;
  }

  if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
    ip_event_got_ip_t *event = (ip_event_got_ip_t *)event_data;
    esp_ip4_addr_t *ip = &event->ip_info.ip;
    ESP_LOGI(TAG, "got ip:" IPSTR, IP2STR(ip));
    init_sntp();
    set_status(ACTIVE);
    int sockfd = init_tcp_socket(REMOTE_IP, REMOTE_PORT);
    server_handshake(ip, sockfd);
    start_data_collection(sockfd);
  }
}

void wifi_init() {
  esp_err_t ret = nvs_flash_init();
  if (ret == ESP_ERR_NVS_NO_FREE_PAGES ||
      ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
    ESP_ERROR_CHECK(nvs_flash_erase());
    ESP_ERROR_CHECK(nvs_flash_init());
  }

  ESP_ERROR_CHECK(esp_netif_init());
  ESP_ERROR_CHECK(esp_event_loop_create_default());

  esp_netif_create_default_wifi_sta();
  wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
  ESP_ERROR_CHECK(esp_wifi_init(&cfg));

  esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID,
                                      &wifi_event_handler, NULL, NULL);
  esp_event_handler_instance_register(IP_EVENT, IP_EVENT_STA_GOT_IP,
                                      &wifi_event_handler, NULL, NULL);

  wifi_config_t wifi_config = {
      .sta =
          {
              .ssid = WIFI_AP_SSID,
              .password = WIFI_AP_PASSWORD,
          },
  };

  ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
  ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config));
  set_status(CONNECTING);
  ESP_ERROR_CHECK(esp_wifi_start());
}
