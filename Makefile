export CGO_ENABLED=1
DB_NAME="esp32_envmon"

.PHONY: help
help: ## Shows this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: ## Build the esp app
	idf.py -C sensing app

.PHONY: shell
shell: ## Spawns a shell inside container
	docker exec -it esp32-env-monitor /bin/sh

.PHONY: flash
flash: ## Flash the esp app to /dev/ttyUSB0
	idf.py -C sensing -p /dev/ttyUSB0 app-flash

.PHONY: serial
serial: ## Open the serial console
	idf.py -C sensing monitor

.PHONY: esp
esp: ## Builds, flashes and open the serial for the esp app
	make build flash serial

.PHONY: setup
setup: ## Full build of the esp project
	idf.py -C sensing build
	idf.py -C sensing -p /dev/ttyUSB0 flash

.PHONY: compose
compose: ## Build the backend docker compose
	docker-compose build

.PHONY: upd
upd: ## Start the compose project
	docker-compose up -d

.PHONY: logs
logs: ## Show logs of the docker compose image
	docker-compose -f docker-compose.yml  logs -f api

.PHONY: web-logs
web-logs: ## Show logs of the docker compose image
	docker-compose -f docker-compose.yml  logs -f web

.PHONY: restart
restart: ## Restart the compose project
	docker-compose -f docker-compose.yml restart

.PHONY: stop
stop: ## Restart the compose project
	docker-compose -f docker-compose.yml stop

.PHONY: go
go: ## Build the go server
	cd provider && go build -o build/main cmd/main.go cmd/datasync.go cmd/api.go cmd/service.go cmd/logging.go cmd/db.go

.PHONY: web
web: ## Start locally the webapp
	cd web && pnpm dev

.PHONY: sqlconsole
sqlconsole: ## Connect to the postgres db
	psql -U root -d $(DB_NAME) -h localhost

.PHONY: init-db
init-db: ## Initialize db
	psql -U root -d $(DB_NAME) -h localhost < db.init.sql

.PHONE: dump-db
dump-db: ## Dump the database content
	pg_dump -U root -h localhost -p 5432 -d $(DB_NAME) -F p -f db.init.sql


