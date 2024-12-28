package main

import (
	"net"
	"time"
)

func InitTcpSocket(service *Service) {
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
		go handleUnitConnection(conn, service)
	}
}

func handleUnitConnection(conn net.Conn, service *Service) {
	for {
		buffer := make([]byte, 16)
		readBytes, err := conn.Read(buffer)
		if readBytes == 0 {
			time.Sleep(time.Second)
			continue
		}
		if err != nil {
			log.Errorln("unable to read data from socket", err)
			continue
		}
		service.AppendReading(buffer)
		time.Sleep(time.Second)
	}
}
