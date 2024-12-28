#include "credentials.h"
#include "dht.h"
#include "esp_log.h"
#include "freertos/idf_additions.h"
#include "locals.h"
#include "lwip/sockets.h"
#include "state.h"
#include "time.h"

char *dht_collect(int sockfd) {
  int16_t humidity = 0;
  int16_t temp = 0;

  dht_read_data(DHT_TYPE_DHT11, DHT11_GPIO_NUMBER, &humidity, &temp);
  if (humidity == 0 && temp == 0) {
    ESP_LOGE(TAG, "dht sensor not initialized, reboot required");
    set_status(ERROR);
  }
  char *payload = (char *)malloc(32 * sizeof(char));
  time_t now;
  time(&now);
  sprintf(payload, "%lli,%i,%i", now, (int)humidity / 10, (int)temp / 10);
  return payload;
}

void start_data_collection(int sockfd) {
  vTaskDelay(1000 / portTICK_PERIOD_MS);
  while (true) {
    char *payload = dht_collect(sockfd);
    ESP_LOGI(TAG, "sending telemetry to server: %s", payload);
    ssize_t send_result = send(sockfd, payload, strlen(payload), 0);
    if (send_result == -1) {
      ESP_LOGE(TAG, "error sending data over tcp socket");
      set_status(ERROR);
    }
    vTaskDelay(DHT_SENSING_PERIOD_S * 1000 / portTICK_PERIOD_MS);
  }
}
