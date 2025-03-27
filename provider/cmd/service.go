package main

import (
	"database/sql"
	"strconv"
	"strings"
	"time"
)

type UnitStatus string

type UnitConnectionData struct {
	Status     UnitStatus `json:"unitStatus"`
	LastUpdate *int       `json:"lastUpdate"`
}

type Unit struct {
	Id            int        `db:"id"`
	Name          string     `db:"name"`
	LastUpdate    int        `db:"last_update"`
	IpAddr        *string    `db:"ip_addr"`
	CurrentStatus UnitStatus `db:"unit_status"`
}

type Record struct {
	Id          int `db:"id" json:"id"`
	Timestamp   int `db:"ts" json:"timestamp"`
	Humidity    int `db:"humidity" json:"humidity"`
	Temperature int `db:"temperature" json:"temperature"`
}

const (
	Online  UnitStatus = "ONLINE"
	Offline UnitStatus = "OFFLINE"
)

type Service struct {
	db              *sql.DB
	registeredUnits map[int]UnitConnectionData
}

func (service *Service) FetchRecords(start time.Time, end time.Time) ([]*Record, error) {
	result, err := service.db.Query("SELECT * FROM records WHERE ts BETWEEN $1 AND $2", start, end)
	if err != nil {
		log.Errorln("interval records failed", err)
		return make([]*Record, 0), err
	}
	var records []*Record = make([]*Record, 0)
	for result.Next() {
		var record *Record = &Record{Id: 0, Timestamp: 0, Humidity: 0, Temperature: 0}
		result.Scan(&record.Id, &record.Timestamp, &record.Humidity, &record.Temperature)
		records = append(records, record)
	}
	return records, nil
}

func (service *Service) FetchAllRecords() ([]*Record, error) {
	result, err := service.db.Query("SELECT * FROM records;")
	if err != nil {
		log.Errorln("error retrieving all records", err)
		return make([]*Record, 0), err
	}
	var records []*Record = make([]*Record, 0)
	for result.Next() {
		var record *Record = &Record{Id: 0, Timestamp: 0, Humidity: 0, Temperature: 0}
		result.Scan(&record.Id, &record.Timestamp, &record.Humidity, &record.Temperature)
		records = append(records, record)
	}
	return records, nil
}

func (service *Service) LastKnownRecord() *Record {
	result, _ := service.db.Query("SELECT * FROM records ORDER BY timestamp DESC LIMIT 1;")
	if result.Next() {
		var record Record = Record{Id: 0, Timestamp: 0, Humidity: 0, Temperature: 0}
		result.Scan(record.Id, record.Timestamp, record.Humidity, record.Temperature)
		return &record
	}
	return nil
}

func (service *Service) GetUnitStatus() UnitConnectionData {
	lastRecord := service.LastKnownRecord()
	if lastRecord == nil {
		return UnitConnectionData{Status: Offline, LastUpdate: nil}
	}
	offlineThreshold := time.Minute
	lastRecordTime := time.Unix(int64(lastRecord.Timestamp), 0)
	lastRecordTimestamp := int(lastRecordTime.Unix())
	if lastRecordTime.Add(offlineThreshold).Before(time.Now()) {
		return UnitConnectionData{Status: Offline, LastUpdate: &lastRecordTimestamp}
	}
	return UnitConnectionData{Status: Online, LastUpdate: &lastRecordTimestamp}
}

func (service *Service) UnitConnection(data string) {
	values := strings.Split(data, ",")
	timestamp, _ := strconv.Atoi(values[1])
	unitId, _ := strconv.Atoi(values[2])
	service.registeredUnits[unitId] = UnitConnectionData{Status: Online, LastUpdate: &timestamp}
	unitRow := service.db.QueryRow("SELECT * FROM unit WHERE id = $1", unitId)
	var currentUnit Unit
	err := unitRow.Scan(&currentUnit)
	if err == sql.ErrNoRows {
		log.Infoln("new unit detected", unitId)
        service.db.Exec("INSERT INTO unit VALUES ($1, $2, $3, $4)", "", timestamp, )
	}
	if err != nil {
		log.Errorln("Service.UnitConnection", err)
	}
}

func (service *Service) AppendReading(data string) {
	values := strings.Split(data, ",")
	temperature, _ := strconv.Atoi(values[1])
	humidity, _ := strconv.Atoi(values[2])
    _, err := service.db.Exec("INSERT INTO records(ts, temperature, humidity) VALUES ($1, $2, $3)", time.Now(), temperature, humidity)
    if err != nil {
        log.Errorln("Service.AppendReading", err)
    }
}
