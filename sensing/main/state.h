#pragma once

static const char *S_TAG = "state";

typedef enum { CONNECTING, INITIALIZING, CONNECTED, ACTIVE, IDLE } Status;

static Status global_status = INITIALIZING;

char *status_str(Status status);

void handle_ACTIVE();

void handle_CONNECTED();

void handle_CONNECTING();

void handle_INITIALIZING();

void handle_IDLE();

void set_status(Status next);
