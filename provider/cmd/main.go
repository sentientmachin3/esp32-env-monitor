package main

import (
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

func main() {
	InitLogger()
	db := InitDb()

	defer db.Close()
	var workGroup sync.WaitGroup
	go tcpHandler(Service{db: db})
	go httpHandler(Service{db: db})
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
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(cors.Default())
	SetupRoutes(r, &service)
	r.Run(":3080")
}
