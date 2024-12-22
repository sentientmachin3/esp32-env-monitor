package main

import (
	"database/sql"
	"sync"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	_ "modernc.org/sqlite"
)

func main() {
	logger, _ := zap.NewDevelopment()
	log := logger.Sugar()
	var workGroup sync.WaitGroup

	db, err := sql.Open("sqlite", "/usr/app/data.db")
	defer db.Close()
	defer logger.Sync()

	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	log.Infoln("database loaded and ready")
	go tcpHandler(db, log)
	go httpHandler(db, log)
	workGroup.Add(2)
	workGroup.Wait()
}

func tcpHandler(db *sql.DB, log *zap.SugaredLogger) {
	log.Debugln("setting up tcp endpoints")
	InitTcpSocket(log, db)
	log.Infoln("tcp socket set up")
}

func httpHandler(db *sql.DB, log *zap.SugaredLogger) {
	log.Debugln("setting up http endpoints")
	r := gin.Default()
	SetupRoutes(r, log, db)
	r.Run(":3080")
}
