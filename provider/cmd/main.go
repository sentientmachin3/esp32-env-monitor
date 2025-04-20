package main

import (
	"os"
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

func main() {
	InitLogger()
	user := os.Getenv("POSTGRES_USER")
	dbName := os.Getenv("POSTGRES_DB")
	password := os.Getenv("POSTGRES_PASSWORD")
	host := os.Getenv("POSTGRES_HOST")
	db := InitDb(host, user, password, dbName)

	defer db.Close()
	var workGroup sync.WaitGroup
	service := Service{db: db, registeredUnits: make(map[int]UnitConnectionData)}
	go tcpHandler(service)
	go httpHandler(service)
	workGroup.Add(2)
	workGroup.Wait()
}

func tcpHandler(service Service) {
	log.Debugln("setting up tcp endpoints")
	InitTcpSocket(&service)
	log.Infoln("tcp socket set up")
}

func httpHandler(service Service) {
	log.Debugln("setting up http endpoints")
	// Just to remove the default gin logger
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(cors.Default())
	SetupRoutes(r, &service)
	r.Run(":3080")
}
