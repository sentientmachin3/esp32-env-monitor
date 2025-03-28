package main

import (
	"io"
	"net"
	"strconv"
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
		go handleSocketData(conn, service)
	}
}

func handleSocketData(conn net.Conn, service *Service) {
	for {
		buffer := make([]byte, 32)
		readBytes, err := conn.Read(buffer)
		if err == io.EOF || readBytes == 0 {
			time.Sleep(time.Second)
			continue
		}
		if err != nil {
			log.Errorln("unable to read data from socket", err)
			continue
		}
		data := string(buffer)[:readBytes]
		msgType, _ := strconv.Atoi(string(data[0]))
		log.Debugf("received msg %s type %v", data, msgType)
		if msgType == MSG_TYPE_HANDSHAKE {
			service.UnitConnection(data)
		} else if msgType == MSG_TYPE_TELEMETRY {
			service.AppendReading(data)
		} else {
			log.Errorln("unsupported msg type", err)
		}
		time.Sleep(time.Second)
	}
}
