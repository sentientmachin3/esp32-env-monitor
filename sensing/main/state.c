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
  case CONNECTED:
    return "CONNECTED";
  case ACTIVE:
    return "ACTIVE";
  case IDLE:
    return "IDLE";
  default:
    return "INVALID";
  }
}

void handle_ACTIVE() {
  gpio_set_level(STATUS_KO_GPIO, 0);
  gpio_set_level(STATUS_OK_GPIO, 1);
}

void handle_CONNECTED() {
  gpio_set_level(STATUS_KO_GPIO, 0);
  while (global_status == CONNECTED) {
    gpio_set_level(STATUS_OK_GPIO, 1);
    vTaskDelay(500 / portTICK_PERIOD_MS);
    gpio_set_level(STATUS_OK_GPIO, 1);
    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

void handle_CONNECTING() {
  gpio_set_level(STATUS_OK_GPIO, 0);
  while (global_status == CONNECTING) {
    gpio_set_level(STATUS_KO_GPIO, 1);
    vTaskDelay(100 / portTICK_PERIOD_MS);
    gpio_set_level(STATUS_KO_GPIO, 1);
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void handle_INITIALIZING() {
  while (global_status == INITIALIZING) {
    gpio_set_level(STATUS_OK_GPIO, 1);
    gpio_set_level(STATUS_OK_GPIO, 1);
    vTaskDelay(100 / portTICK_PERIOD_MS);

    gpio_set_level(STATUS_OK_GPIO, 0);
    gpio_set_level(STATUS_OK_GPIO, 0);
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void handle_IDLE() {
  gpio_set_level(STATUS_KO_GPIO, 0);
  gpio_set_level(STATUS_OK_GPIO, 0);
}

void set_status(Status next) {
  ESP_LOGI(S_TAG, "%s => %s", status_str(global_status), status_str(next));
  global_status = next;
  switch (next) {
  case CONNECTING:
    return handle_CONNECTING();
  case INITIALIZING:
    return handle_INITIALIZING();
  case CONNECTED:
    return handle_CONNECTED();
  case IDLE:
    return handle_IDLE();
  case ACTIVE:
    return handle_ACTIVE();
  default:
    ESP_LOGE("state", "invalid status %i", next);
  }
  return;
}
