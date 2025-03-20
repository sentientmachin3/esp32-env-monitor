package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func InitDb(host string, user string, password string, dbName string) *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, user, password, dbName)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	err = db.Ping()
	if err != nil {
		log.Errorln("db connection failed", err)
		panic(err)
	}
	log.Infoln("database loaded and ready")
	return db
}
