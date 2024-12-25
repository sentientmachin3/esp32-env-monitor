#include "esp_log.h"
#include "esp_netif_sntp.h"
#include "esp_sntp.h"
#include "locals.h"
#include <sys/time.h>

static const char *SNTP_TAG = "SNTP";

void init_sntp(void) {
  ESP_LOGI(SNTP_TAG, "syncing sntp");
  esp_sntp_config_t config = ESP_NETIF_SNTP_DEFAULT_CONFIG(SNTP_SERVER_NAME);
  esp_netif_sntp_init(&config);
  if (esp_netif_sntp_sync_wait(pdMS_TO_TICKS(10000)) != ESP_OK) {
    ESP_LOGE(SNTP_TAG, "timeout sntp sync (10 seconds)");
  }
  ESP_LOGI(SNTP_TAG, "sync successful");
  esp_sntp_stop();
}
