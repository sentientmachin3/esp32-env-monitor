#include "credentials.h"
#include "esp_interface.h"
#include "esp_log.h"
#include "esp_wifi.h"
#include "esp_wifi_types_generic.h"

static const char *NET_TAG = "network";

esp_err_t wifi_init() {
  wifi_init_config_t wifi_config = WIFI_INIT_CONFIG_DEFAULT();
  return esp_wifi_init(&wifi_config);
}

int wifi_connect() {
  esp_wifi_set_mode(WIFI_MODE_STA);
  wifi_config_t config = {.sta = {.ssid = WIFI_AP_SSID,
                                  .password = WIFI_AP_PASSWORD,
                                  .channel = 11}};
  esp_err_t config_set = esp_wifi_set_config(ESP_IF_WIFI_STA, &config);
  if (config_set != ESP_OK) {
    ESP_LOGE(NET_TAG, "esp_wifi_set_config error: %s",
             esp_err_to_name(config_set));
    return 0;
  }
  esp_wifi_start();
  esp_wifi_connect();
  return 1;
}
