package main

import (
	"net/http"
	"slices"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, service *Service) {
	r.GET("/records", handleRecordsByInterval(service))
	r.GET("/status", handleStatus(service))
}

func handleRecordsByInterval(service *Service) gin.HandlerFunc {
	return func(context *gin.Context) {
		query := context.Request.URL.Query()
		allowedIntervals := []RecordInterval{HalfHour, OneDay, OneWeek, OneMonth, TwoWeeks}
		requestedInterval := RecordInterval(query.Get("interval"))
		if !slices.Contains(allowedIntervals, requestedInterval) {
			context.Status(http.StatusBadRequest)
			return
		}
		var jsonRows []*Record
		log.Debugf("request logs in last %v", requestedInterval)
		intervalStart := time.Now().Add(-service.IntervalToDuration(requestedInterval))
		intervalEnd := time.Now()
		records, err := service.FetchRecords(intervalStart, intervalEnd, requestedInterval)
		jsonRows = records
		if err != nil {
			context.Status(http.StatusInternalServerError)
			return
		}
		context.JSON(http.StatusOK, jsonRows)
	}
}

func handleStatus(service *Service) gin.HandlerFunc {
	return func(context *gin.Context) {
		unitStatus := service.GetUnitStatus()
		context.JSON(http.StatusOK, unitStatus)
	}
}
