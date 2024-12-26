package main

import (
	"database/sql"

	"go.uber.org/zap"
)

type Stat struct {
	Id          int `db:"id" json:"id"`
	Timestamp   int `db:"timestamp" json:"timestamp"`
	Humidity    int `db:"humidity" json:"humidity"`
	Temperature int `db:"temperature" json:"temperature"`
}

func FetchStats(db *sql.DB, log *zap.SugaredLogger, start int, end int) ([]*Stat, error) {
	log.Infoln("loading stats from %i to %i", start, end)
	result, err := db.Query("SELECT * FROM records WHERE timestamp BETWEEN $1 AND $2", start, end)
	if err != nil {
		log.Errorln("interval stats failed", err)
		return make([]*Stat, 0), err
	}
	var stats []*Stat = make([]*Stat, 0)
	for result.Next() {
		var stat Stat
		result.Scan(&stat.Id, &stat.Timestamp, &stat.Humidity, &stat.Temperature)
		stats = append(stats, &stat)
	}
	return stats, nil
}

func FetchAllStats(db *sql.DB, log *zap.SugaredLogger) ([]*Stat, error) {
	result, err := db.Query("SELECT * FROM records")
	if err != nil {
		log.Errorln("interval stats failed", err)
		return make([]*Stat, 0), err
	}
	var stats []*Stat = make([]*Stat, 0)
	for result.Next() {
		var stat Stat
		result.Scan(&stat.Id, &stat.Timestamp, &stat.Humidity, &stat.Temperature)
		stats = append(stats, &stat)
	}
	return stats, nil
}
