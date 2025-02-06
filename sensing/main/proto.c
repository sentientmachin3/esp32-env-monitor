#include "credentials.h"
#include "esp_log.h"
#include "locals.h"
#include "lwip/sockets.h"
#include "state.h"
#include "time.h"

#define MSG_TYPE_HANDSHAKE 0
#define MSG_TYPE_TELEMETRY 1

char *prepare_handshake_msg(int unit_id) {
  char *payload = (char *)malloc(32 * sizeof(char));
  time_t now;
  time(&now);
  sprintf(payload, "%i,%lli,%i", MSG_TYPE_HANDSHAKE, now, unit_id);
  return payload;
}

char *prepare_telemetry_msg(dht_reading *data) {
  char *payload = (char *)malloc(32 * sizeof(char));
  time_t now;
  time(&now);
  sprintf(payload, "%i,%lli,%i,%i", MSG_TYPE_TELEMETRY, now, data->humidity,
          data->temperature);
  return payload;
}

void send_proto_msg(int sockfd, char *payload) {
  time_t now;
  time(&now);
  ssize_t send_result = send(sockfd, payload, strlen(payload), 0);
  if (send_result == -1) {
    ESP_LOGE(TAG, "error sending socket data");
    set_status(ERROR);
  }
}
