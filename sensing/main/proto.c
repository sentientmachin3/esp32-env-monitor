#include "credentials.h"
#include "esp_log.h"
#include "locals.h"
#include "lwip/sockets.h"
#include "state.h"
#include <string.h>

#define MSG_TYPE_HANDSHAKE 0
#define MSG_TYPE_TELEMETRY 1

char *prepare_handshake_msg(int unit_id) {
  char *buffer = (char *)malloc(16 * sizeof(char));
  int length = sprintf(buffer, "%i,%i", MSG_TYPE_HANDSHAKE, unit_id);
  char *payload = (char *)malloc((length + 1) * sizeof(char));
  strcpy(payload, buffer);
  return payload;
}

char *prepare_telemetry_msg(dht_reading *data) {
  char *buffer = (char *)malloc(16 * sizeof(char));
  int length = sprintf(buffer, "%i,%i,%i", MSG_TYPE_TELEMETRY, data->humidity,
                       data->temperature);
  char *payload = (char *)malloc((length + 1) * sizeof(char));
  strcpy(payload, buffer);
  return payload;
}

void send_proto_msg(int sockfd, char *payload) {
  ESP_LOGD(TAG, "sending protocol message %s", payload);
  ssize_t send_result = send(sockfd, payload, (int)strlen(payload), 0);
  if (send_result == -1) {
    ESP_LOGE(TAG, "error sending socket data");
    set_status(ERROR);
  }
}
