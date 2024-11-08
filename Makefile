.PHONY: help
help: ## Shows this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: ## Build the esp app
	idf.py -C sensing app

.PHONY: flash
flash: ## Flash the esp app to /dev/ttyUSB0
	idf.py -C sensing -p /dev/ttyUSB0 app-flash

.PHONY: serial
monitor: ## Open the serial console
	idf.py -C sensing monitor

.PHONY: app
app: ## Builds, flashes and open the serial for the esp app
	build flash serial

.PHONY: setup
setup: ## Full build of the esp project
	idf.py -C sensing build
	idf.py -C sensing -p /dev/ttyUSB0 flash

.PHONY: compose-build
compose-build: ## Build the backend docker compose
	cd provider && docker-compose build

.PHONY: upd
upd: ## Start the compose project
	cd provider && docker-compose up -d

.PHONY: logs
logs: ## Show logs of the docker compose image
	docker-compose -f provider/docker-compose.yml logs -f

.PHONY: restart
restart: ## Restart the compose project
	docker-compose -f provider/docker-compose.yml restart
