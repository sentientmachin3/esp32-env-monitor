#include "credentials.h"
#include "esp_log.h"
#include "network.c"
#include <unistd.h>

static const char *MAIN_TAG = "main";

void app_main() {
  esp_log_level_set(MAIN_TAG, ESP_LOG_VERBOSE);
  esp_log_level_set(NET_TAG, ESP_LOG_VERBOSE);
  esp_log_level_set(DHT_TAG, ESP_LOG_VERBOSE);
  esp_log_level_set(SNTP_TAG, ESP_LOG_VERBOSE);

  wifi_init();
}
