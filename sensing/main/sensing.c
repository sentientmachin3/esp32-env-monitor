#include "credentials.h"
#include "dht.h"
#include "esp_log.h"
#include "freertos/idf_additions.h"
#include "lwip/sockets.h"
#include "time.h"

static const char *DHT_TAG = "dht";

void dht_collect(int sockfd) {
  int16_t humidity = 0;
  int16_t temp = 0;
  vTaskDelay(1000 / portTICK_PERIOD_MS);

  while (true) {
    dht_read_data(DHT_TYPE_DHT11, DHT11_GPIO_NUMBER, &humidity, &temp);
    char *payload = (char *)malloc(32 * sizeof(char));
    time_t now;
    time(&now);
    sprintf(payload, "%lli,%i,%i", now, (int)humidity / 10, (int)temp / 10);
    ESP_LOGD(DHT_TAG, "sending telemetry to server: %s", payload);
    send(sockfd, payload, strlen(payload), 0);
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void start_data_collection(int sockfd) { dht_collect(sockfd); }
