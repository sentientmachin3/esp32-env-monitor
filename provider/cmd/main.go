package main

import (
	"database/sql"
	"net"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewDevelopment()
	log := logger.Sugar()
	defer logger.Sync()

	dbPath := os.Getenv("DATABASE_PATH")
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()
	ln, err := net.Listen("tcp4", ":8080")
	if err != nil {
		log.Errorln("err creating socket", err)
		return
	}
	log.Debugln("socket created", ln.Addr())
	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Errorln("ln.Accept failed", err)
		}
		log.Infoln("new connection received", conn.RemoteAddr())
		go handle(conn, log)
	}
}

func handle(conn net.Conn, log *zap.SugaredLogger) {
	for {
		buffer := make([]byte, 16)
		conn.Read(buffer)
		data := string(buffer)
		log.Debugln("string", data)
		time.Sleep(time.Second)
	}
}
