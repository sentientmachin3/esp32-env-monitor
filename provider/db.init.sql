CREATE DATABASE esp32_envmon;

CREATE TYPE unit_status AS ENUM ('online', 'offline');

CREATE TABLE records (
    id SERIAL PRIMARY KEY ,
    timestamp INTEGER DEFAULT NULL,
    temperature INTEGER NOT NULL,
    humidity INTEGER NOT NULL
);

CREATE TABLE unit (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    last_update TIMESTAMP,
    ip_addr VARCHAR(15),
    current_status unit_status
);
