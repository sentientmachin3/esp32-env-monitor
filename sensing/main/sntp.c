#include "esp_log.h"
#include "esp_netif_sntp.h"
#include "esp_sntp.h"
#include "locals.h"
#include <sys/time.h>

void init_sntp(void) {
  ESP_LOGI(TAG, "syncing sntp");
  esp_sntp_config_t config = ESP_NETIF_SNTP_DEFAULT_CONFIG(SNTP_SERVER_NAME);
  esp_netif_sntp_init(&config);
  if (esp_netif_sntp_sync_wait(pdMS_TO_TICKS(10000)) != ESP_OK) {
    ESP_LOGE(TAG, "timeout sntp sync (10 seconds)");
  }
  ESP_LOGI(TAG, "sync successful");
  esp_sntp_stop();
}
