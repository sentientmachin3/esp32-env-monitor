.PHONY: build
build:
	idf.py -C sensing app

.PHONY: flash
flash:
	idf.py -C sensing -p /dev/ttyUSB0 app-flash

.PHONY: monitor
monitor:
	idf.py -C sensing monitor

.PHONY: app
app: build flash monitor

.PHONY: setup
setup:
	idf.py -C sensing build
	idf.py -C sensing -p /dev/ttyUSB0 flash
