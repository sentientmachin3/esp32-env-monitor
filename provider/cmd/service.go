package main

import (
	"database/sql"

	"go.uber.org/zap"
)

type Record struct {
	Id          int `db:"id" json:"id"`
	Timestamp   int `db:"timestamp" json:"timestamp"`
	Humidity    int `db:"humidity" json:"humidity"`
	Temperature int `db:"temperature" json:"temperature"`
}

func FetchRecords(db *sql.DB, log *zap.SugaredLogger, start int, end int) ([]*Record, error) {
	result, err := db.Query("SELECT * FROM records WHERE timestamp BETWEEN $1 AND $2", start, end)
	if err != nil {
		log.Errorln("interval records failed", err)
		return make([]*Record, 0), err
	}
	var records []*Record = make([]*Record, 0)
	for result.Next() {
		var record Record
		result.Scan(&record.Id, &record.Timestamp, &record.Humidity, &record.Temperature)
		records = append(records, &record)
	}
	return records, nil
}

func FetchAllRecords(db *sql.DB, log *zap.SugaredLogger) ([]*Record, error) {
	result, err := db.Query("SELECT * FROM records")
	if err != nil {
		log.Errorln("error retrieving all records", err)
		return make([]*Record, 0), err
	}
	var records []*Record = make([]*Record, 0)
	for result.Next() {
		var record Record
		result.Scan(&record.Id, &record.Timestamp, &record.Humidity, &record.Temperature)
		records = append(records, &record)
	}
	return records, nil
}
