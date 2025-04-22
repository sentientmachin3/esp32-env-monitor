#!/bin/zsh

rm -rf build
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o build/main cmd/main.go cmd/datasync.go cmd/api.go cmd/service.go cmd/logging.go cmd/db.go
