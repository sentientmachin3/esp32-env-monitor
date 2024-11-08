#include "credentials.h"
#include "dht.h"
#include "esp_log.h"
#include "network.c"
#include "nvs_flash.h"
#include <unistd.h>

static const char *MAIN_TAG = "main";

void app_main() {
  esp_log_level_set(MAIN_TAG, ESP_LOG_VERBOSE);
  nvs_flash_init();
  esp_err_t init = wifi_init();
  if (init != ESP_OK) {
    ESP_LOGE(MAIN_TAG, "wifi init error: %s", esp_err_to_name(init));
    return;
  }
  int attempts = 0;
  while (attempts < 3) {
    attempts++;
    esp_err_t connected = wifi_connect();
    if (connected) {
      ESP_LOGI(MAIN_TAG, "connection succeeded");
      break;
    }
    ESP_LOGW(MAIN_TAG, "wifi connection attempt %i failed", attempts);
    sleep(2);
  }

  int16_t humidity = 0;
  int16_t temp = 0;
  vTaskDelay(1000 / portTICK_PERIOD_MS);
  while (true) {
    esp_err_t error =
        dht_read_data(DHT_TYPE_DHT11, DHT11_GPIO_NUMBER, &humidity, &temp);
    if (error == ESP_OK) {
      ESP_LOGI(MAIN_TAG, "temperature %i - humidity %i", temp / 10,
               humidity / 10);
    } else {
      ESP_LOGE(MAIN_TAG, "error %s", esp_err_to_name(error));
    }
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}
