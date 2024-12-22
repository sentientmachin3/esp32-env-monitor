#include "credentials.h"
#include "esp_log.h"
#include "network.c"
#include "state.h"
#include <unistd.h>

static const char *MAIN_TAG = "main";

void gpio_init() {
  ESP_LOGI(MAIN_TAG, "initializing gpios");
  gpio_set_direction(STATUS_KO_GPIO, GPIO_MODE_OUTPUT);
  gpio_set_direction(STATUS_OK_GPIO, GPIO_MODE_OUTPUT);
  ESP_LOGI(MAIN_TAG, "gpio init ok");
}

void app_main() {
  esp_log_level_set(MAIN_TAG, ESP_LOG_VERBOSE);
  esp_log_level_set(NET_TAG, ESP_LOG_VERBOSE);
  esp_log_level_set(DHT_TAG, ESP_LOG_VERBOSE);
  esp_log_level_set(SNTP_TAG, ESP_LOG_VERBOSE);
  esp_log_level_set(S_TAG, ESP_LOG_VERBOSE);

  gpio_init();
  wifi_init();
}
