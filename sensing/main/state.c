#include "state.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/idf_additions.h"
#include "locals.h"
#include "state.h"

char *status_str(Status status) {
  switch (status) {
  case CONNECTING:
    return "CONNECTING";
  case INITIALIZING:
    return "INITIALIZING";
  case ACTIVE:
    return "ACTIVE";
  case ERROR:
    return "ERROR";
  default:
    return "INVALID";
  }
}

void handle_ACTIVE() {
  while (global_status == ACTIVE) {
    gpio_set_level(STATUS_KO_GPIO, 0);
    gpio_set_level(STATUS_OK_GPIO, 1);
    vTaskDelay(50 / portTICK_PERIOD_MS);
    gpio_set_level(STATUS_OK_GPIO, 0);
    vTaskDelay(2000 / portTICK_PERIOD_MS);
  }
}

void handle_CONNECTING() {
  gpio_set_level(STATUS_OK_GPIO, 0);
  while (global_status == CONNECTING) {
    gpio_set_level(STATUS_KO_GPIO, 1);
    vTaskDelay(100 / portTICK_PERIOD_MS);
    gpio_set_level(STATUS_KO_GPIO, 0);
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void handle_INITIALIZING() {
  while (global_status == INITIALIZING) {
    gpio_set_level(STATUS_OK_GPIO, 1);
    gpio_set_level(STATUS_KO_GPIO, 1);
    vTaskDelay(100 / portTICK_PERIOD_MS);

    gpio_set_level(STATUS_OK_GPIO, 0);
    gpio_set_level(STATUS_KO_GPIO, 0);
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void handle_ERROR() {
  gpio_set_level(STATUS_OK_GPIO, 0);
  while (global_status == ERROR) {
    gpio_set_level(STATUS_KO_GPIO, 1);
    vTaskDelay(500 / portTICK_PERIOD_MS);
    gpio_set_level(STATUS_KO_GPIO, 0);
    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

void set_status(Status next) {
  ESP_LOGI(TAG, "%s => %s", status_str(global_status), status_str(next));
  global_status = next;
  return;
}

void state_monitor() {
  while (true) {
    switch (global_status) {
    case CONNECTING:
      handle_CONNECTING();
      break;
    case INITIALIZING:
      handle_INITIALIZING();
      break;
    case ERROR:
      handle_ERROR();
      break;
    case ACTIVE:
      handle_ACTIVE();
      break;
    default:
      ESP_LOGE(TAG, "invalid status %i", global_status);
    }
  }
}
