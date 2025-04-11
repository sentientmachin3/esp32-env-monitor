package main

import (
	"database/sql"
	"strconv"
	"strings"
	"time"
)

type UnitConnectionData struct {
	Status     UnitStatus `json:"unitStatus"`
	LastUpdate *time.Time `json:"lastUpdate"`
}

type Unit struct {
	Id            int        `db:"id"`
	Name          string     `db:"name"`
	LastUpdate    *time.Time `db:"last_update"`
	IpAddr        *string    `db:"ip_addr"`
	CurrentStatus UnitStatus `db:"unit_status"`
}

type Record struct {
	Id          int       `db:"id" json:"id"`
	Timestamp   time.Time `db:"ts" json:"timestamp"`
	Humidity    int       `db:"humidity" json:"humidity"`
	Temperature int       `db:"temperature" json:"temperature"`
}

type UnitStatus string

const (
	Online  UnitStatus = "online"
	Offline UnitStatus = "offline"
)

type RecordInterval string

const (
	OneDay   RecordInterval = "1d"
	HalfHour RecordInterval = "30m"
	OneWeek  RecordInterval = "1w"
	TwoWeeks RecordInterval = "2w"
	OneMonth RecordInterval = "1M"
)

type Service struct {
	db              *sql.DB
	registeredUnits map[int]UnitConnectionData
}

func (service *Service) FetchRecords(start time.Time, end time.Time, interval RecordInterval) ([]*Record, error) {
	result, err := service.db.Query("SELECT id, ts, temperature, humidity FROM records WHERE ts BETWEEN $1 AND $2", start, end)
	if err != nil {
		log.Errorln("interval records failed", err)
		return make([]*Record, 0), err
	}
	var records []*Record = make([]*Record, 0)
	for result.Next() {
		var record *Record = &Record{Id: 0, Timestamp: time.Now(), Humidity: 0, Temperature: 0}
		result.Scan(&record.Id, &record.Timestamp, &record.Temperature, &record.Humidity)
		log.Debugf("%+v", record)
		records = append(records, record)
	}
	return service.condensate(records, interval), nil
}

func (service *Service) LastKnownRecord() *Record {
	result, _ := service.db.Query("SELECT id, ts, humidity, temperature FROM records ORDER BY ts DESC LIMIT 1;")
	if result.Next() {
		var record *Record = &Record{Id: 0, Timestamp: time.Now(), Humidity: 0, Temperature: 0}
		result.Scan(record.Id, record.Timestamp, record.Humidity, record.Temperature)
		return record
	}
	return nil
}

func (service *Service) GetUnitStatus() UnitConnectionData {
	lastRecord := service.LastKnownRecord()
	if lastRecord == nil {
		return UnitConnectionData{Status: Offline, LastUpdate: nil}
	}
	offlineThreshold := time.Minute
	if lastRecord.Timestamp.Add(offlineThreshold).Before(time.Now()) {
		return UnitConnectionData{Status: Offline, LastUpdate: &lastRecord.Timestamp}
	}
	return UnitConnectionData{Status: Online, LastUpdate: &lastRecord.Timestamp}
}

func (service *Service) UnitConnection(data string) {
	values := strings.Split(data, ",")
	unitId, _ := strconv.Atoi(values[1])
	timestamp := time.Now()
	service.registeredUnits[unitId] = UnitConnectionData{Status: Online, LastUpdate: &timestamp}
	unitRow := service.db.QueryRow("SELECT * FROM unit WHERE id = $1", unitId)
	var currentUnit Unit
	err := unitRow.Scan(&currentUnit.Id, &currentUnit.Name, &currentUnit.LastUpdate, &currentUnit.IpAddr, &currentUnit.CurrentStatus)
	if err == sql.ErrNoRows {
		log.Infoln("new unit detected", unitId)
		_, err := service.db.Exec("INSERT INTO unit (id, name, last_update, ip_addr, current_status) VALUES (DEFAULT, $1, $2, $3, $4)", "", timestamp, "", Online)
		if err != nil {
			log.Infoln(err)
		}
		return
	}
	if err != nil {
		log.Errorln("Service.UnitConnection", err)
	}
}

func (service *Service) AppendReading(data string) {
	values := strings.Split(data, ",")
	temperature, _ := strconv.Atoi(values[1])
	humidity, _ := strconv.Atoi(values[2])
	_, err := service.db.Exec("INSERT INTO records(ts, temperature, humidity) VALUES ($1, $2, $3)", time.Now(), temperature/10, humidity/10)
	if err != nil {
		log.Errorln("Service.AppendReading", err)
	}
}

func (service *Service) condensate(records []*Record, interval RecordInterval) []*Record {
	filtered := make([]*Record, 0)
	if len(records) == 0 {
		return filtered
	}
	granularity, _ := time.ParseDuration("1m")
	switch interval {
	case OneWeek:
		granularity, _ = time.ParseDuration("1h")
	case OneDay:
		granularity, _ = time.ParseDuration("30m")
	case OneMonth:
		granularity, _ = time.ParseDuration("6h")
	case HalfHour:
		granularity, _ = time.ParseDuration("1m")
	case TwoWeeks:
		granularity, _ = time.ParseDuration("1h")
	}
	filtered = append(filtered, records[0])
	for _, r := range records {
		lastRecord := filtered[len(filtered)-1]
		if r.Timestamp.After(lastRecord.Timestamp.Add(granularity)) {
			filtered = append(filtered, r)
		}
	}
	return filtered
}

func (service *Service) IntervalToDuration(interval RecordInterval) time.Duration {
	switch interval {
	case OneWeek:
		return 7 * 24 * time.Hour
	case OneDay:
		return 24 * time.Hour
	case OneMonth:
		return 30 * 24 * time.Hour
	case HalfHour:
		return 30 * time.Minute
	case TwoWeeks:
		return 14 * 24 * time.Hour
	default:
		return 30 * time.Minute
	}
}
