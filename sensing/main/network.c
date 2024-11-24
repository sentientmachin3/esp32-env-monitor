#include "cc.h"
#include "credentials.h"
#include "esp_interface.h"
#include "esp_log.h"
#include "esp_wifi.h"
#include "esp_wifi_types_generic.h"
#include "lwip/sockets.h"
#include "nvs_flash.h"
#include "sensing.c"

static const char *NET_TAG = "network";

int init_tcp_socket(char *host, int port) {
  ESP_LOGD(NET_TAG, "setting up socket");
  int sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_IP);
  if (sockfd < 0) {
    ESP_LOGE(NET_TAG, "unable to create socket: errno %d", errno);
    return -1;
  }
  const struct sockaddr_in server_addr = {.sin_addr.s_addr = inet_addr(host),
                                          .sin_family = AF_INET,
                                          .sin_port = htons(port)};
  ESP_LOGI(NET_TAG, "socket created, connecting to %s:%d", host, port);
  int err =
      connect(sockfd, (struct sockaddr *)&server_addr, sizeof(struct sockaddr));
  if (err != 0) {
    ESP_LOGE(NET_TAG, "socket unable to connect: errno %d", errno);
    close(sockfd);
    return -1;
  }
  ESP_LOGI(NET_TAG, "connected");
  return sockfd;
}

void wifi_event_handler(void *arg, esp_event_base_t event_base,
                        int32_t event_id, void *event_data) {
  ESP_LOGI(NET_TAG, "event_base %s, evt %li", event_base, (long int)event_id);
  if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_START) {
    esp_wifi_connect();
    return;
  }

  if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_CONNECTED) {
    ESP_LOGI(NET_TAG, "wifi connected");
  }

  if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {
    ESP_LOGI(NET_TAG, "wifi disconnected");
    return;
  }

  if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
    ip_event_got_ip_t *event = (ip_event_got_ip_t *)event_data;
    ESP_LOGI(NET_TAG, "got ip:" IPSTR, IP2STR(&event->ip_info.ip));
    int sockfd = init_tcp_socket(REMOTE_IP, REMOTE_PORT);
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

  ESP_ERROR_CHECK(esp_event_handler_instance_register(
      WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, NULL));
  ESP_ERROR_CHECK(esp_event_handler_instance_register(
      IP_EVENT, IP_EVENT_STA_GOT_IP, &wifi_event_handler, NULL, NULL));

  wifi_config_t wifi_config = {
      .sta =
          {
              .ssid = WIFI_AP_SSID,
              .password = WIFI_AP_PASSWORD,
          },
  };

  ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
  ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config));
  ESP_ERROR_CHECK(esp_wifi_start());
}