# ESP32 env monitor

## Board status

- INITIALIZING: setting GPIOs initial values, preparing WiFI board
- CONNECTING: wifi is connecting to the network
- ACTIVE: connection to the network is ok, DHT is OK, active reading and uploading
- ERROR: DHT init failed or wifi connection failed, required reboot

## LEDs status configurations

- INITIALIZING: both LEDs blink for 100 ms every second
- CONNECTING: green OFF, red ON for 100 ms every second
- ACTIVE: red OFF, green ON for 50 ms every two seconds
- ERROR: green OFF, red ON in 500 ms cycles
