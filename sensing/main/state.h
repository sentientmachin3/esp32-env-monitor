#pragma once

#include <stdint.h>

typedef struct {
  int16_t humidity;
  int16_t temperature;
} dht_reading;

typedef enum { CONNECTING, INITIALIZING, ACTIVE, ERROR, HANDSHAKE } Status;

static Status global_status = INITIALIZING;

char *status_str(Status status);

void handle_ACTIVE();

void handle_CONNECTING();

void handle_INITIALIZING();

void handle_ERROR();

void set_status(Status next);

void state_monitor();
