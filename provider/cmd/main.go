package main

import (
	"database/sql"
	"net"
	"strconv"
	"strings"
	"time"

	"go.uber.org/zap"
	_ "modernc.org/sqlite"
)

func main() {
	logger, _ := zap.NewDevelopment()
	log := logger.Sugar()
	defer logger.Sync()

	db, err := sql.Open("sqlite", "/usr/app/data.db")
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	log.Infoln("database loaded and ready")
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
		go handle(conn, db, log)
	}
}

func handle(conn net.Conn, db *sql.DB, log *zap.SugaredLogger) {
	for {
		buffer := make([]byte, 16)
		conn.Read(buffer)
		data := string(buffer)

		values := strings.Split(data, ",")
		timestamp, _ := strconv.Atoi(values[0])
		temperature, _ := strconv.Atoi(values[1])
		humidity, _ := strconv.Atoi(values[2])
		log.Debugln("string", data)
		_, err := db.Exec("INSERT INTO records(timestamp, temperature, humidity) VALUES ($1, $2, $3)", timestamp, temperature, humidity)
		if err != nil {
			log.Errorln("error writing data to db", err)
		}
		time.Sleep(time.Second)
	}
}
