# ESP32 env monitor

ESP32 based environment temperature and humidity monitor. The repo composes of:

- `sensing`: the code of the ESP32, which is using two LEDs for status output;
- `provider`: a simple golang server to expose the socket to the ESP and the rest api to query from webapps;
- `web`: the main webapp for data visualization

## ESP32 LEDs status (which I tend to forget)

### Board status

- INITIALIZING: setting GPIOs initial values, preparing WiFI board
- CONNECTING: wifi is connecting to the network
- ACTIVE: connection to the network is ok, DHT is OK, active reading and uploading
- ERROR: DHT init failed or wifi connection failed, required reboot

### LEDs status configurations

- INITIALIZING: both LEDs blink for 100 ms every second
- CONNECTING: green OFF, red ON for 100 ms every second
- ACTIVE: red OFF, green ON for 50 ms every two seconds
- ERROR: green OFF, red ON in 500 ms cycles

**Open to critics.**
