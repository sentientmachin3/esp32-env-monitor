#include "esp_err.h"
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
}
