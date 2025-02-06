#include "credentials.h"
#include "dht.h"
#include "esp_log.h"
#include "freertos/idf_additions.h"
#include "locals.h"
#include "proto.c"
#include "state.h"

dht_reading *dht_collect(int sockfd) {
  int16_t humidity = 0;
  int16_t temp = 0;

  dht_read_data(DHT_TYPE_DHT11, DHT11_GPIO_NUMBER, &humidity, &temp);
  if (humidity == 0 && temp == 0) {
    ESP_LOGE(TAG, "dht sensor not initialized, reboot required");
    set_status(ERROR);
  }
  dht_reading *data = (dht_reading *)malloc(sizeof(dht_reading));
  data->humidity = humidity;
  data->temperature = temp;
  return data;
}

void start_data_collection(int sockfd) {
  vTaskDelay(1000 / portTICK_PERIOD_MS);
  while (true) {
    dht_reading *data = dht_collect(sockfd);
    send_proto_msg(sockfd, prepare_telemetry_msg(data));
    vTaskDelay(DHT_SENSING_PERIOD_S * 1000 / portTICK_PERIOD_MS);
  }
}
