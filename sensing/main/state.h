#pragma once

typedef enum { CONNECTING, INITIALIZING, ACTIVE, ERROR } Status;

static Status global_status = INITIALIZING;

char *status_str(Status status);

void handle_ACTIVE();

void handle_CONNECTING();

void handle_INITIALIZING();

void handle_ERROR();

void set_status(Status next);

void state_monitor();
