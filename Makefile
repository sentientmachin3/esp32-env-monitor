.PHONY: build
build:
	idf.py app

.PHONY: flash
flash:
	idf.py -p /dev/ttyUSB0 app-flash

.PHONY: monitor
monitor:
	idf.py monitor

.PHONY: app
app: build flash monitor

.PHONY: setup
setup:
	idf.py build
	idf.py -p /dev/ttyUSB0 flash
