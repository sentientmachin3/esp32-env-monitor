#include "state.h"
#include "credentials.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/idf_additions.h"
#include "state.h"

char *status_str(Status status) {
  switch (status) {
  case CONNECTING:
    return "CONNECTING";
  case INITIALIZING:
    return "INITIALIZING";
  case ACTIVE:
    return "ACTIVE";
  case IDLE:
    return "IDLE";
  case ERROR:
    return "ERROR";
  default:
    return "INVALID";
  }
}

void handle_ACTIVE() {
  gpio_set_level(STATUS_KO_GPIO, 0);
  gpio_set_level(STATUS_OK_GPIO, 1);
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

void handle_IDLE() {
  gpio_set_level(STATUS_KO_GPIO, 0);
  gpio_set_level(STATUS_OK_GPIO, 0);
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
  ESP_LOGI(S_TAG, "%s => %s", status_str(global_status), status_str(next));
  global_status = next;
  return;
}

void state_monitor() {
  while (true) {
    vTaskDelay(100 / portTICK_PERIOD_MS);
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
    case IDLE:
      handle_IDLE();
      break;
    case ACTIVE:
      handle_ACTIVE();
      break;
    default:
      ESP_LOGE(S_TAG, "invalid status %i", global_status);
    }
  }
}
