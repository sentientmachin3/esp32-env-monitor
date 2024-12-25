#include "credentials.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/idf_additions.h"
#include "locals.h"
#include "network.c"
#include "state.h"
#include <unistd.h>

void gpio_init() {
  ESP_LOGI(TAG, "initializing gpios");
  gpio_set_direction(STATUS_KO_GPIO, GPIO_MODE_OUTPUT);
  gpio_set_direction(STATUS_OK_GPIO, GPIO_MODE_OUTPUT);
  ESP_LOGI(TAG, "gpio init ok");
}

void app_main() {
  esp_log_level_set(TAG, ESP_LOG_VERBOSE);

  gpio_init();
  xTaskCreate(state_monitor, "state_monitor", 2048, NULL, 1, NULL);
  wifi_init();
}
