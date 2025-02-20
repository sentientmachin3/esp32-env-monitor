CREATE DATABASE esp32_envmon IF NOT EXISTS;

CREATE TYPE unit_status AS ENUM ('online', 'offline');

CREATE TABLE records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature INTEGER NOT NULL,
    humidity INTEGER NOT NULL
);

CREATE TABLE unit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    last_update DATETIME,
    ip_addr VARCHAR(15),
    current_status unit_status
);
