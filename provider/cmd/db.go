package main

import "database/sql"

func InitDb() *sql.DB {
	db, err := sql.Open("sqlite", "/usr/app/data.db")
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	log.Infoln("database loaded and ready")
	return db
}
