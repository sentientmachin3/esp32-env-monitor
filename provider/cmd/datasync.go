package main

import (
	"net"
	"time"
)

const (
	MSG_TYPE_HANDSHAKE = 0
	MSG_TYPE_TELEMETRY = 1
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
		} else if buffer[0] == MSG_TYPE_HANDSHAKE {
			service.UnitConnection(buffer)
		} else if buffer[0] == MSG_TYPE_TELEMETRY {
			service.AppendReading(buffer)
		} else {
			log.Errorln("unsupported msg type", err)
		}
		if err != nil {
			log.Errorln("unable to read data from socket", err)
			continue
		}
		time.Sleep(time.Second)
	}
}
