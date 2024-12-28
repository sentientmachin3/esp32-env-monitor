package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, service *Service) {
	r.GET("/records", handleRecords(service))
	r.GET("/status", handleStatus(service))
}

func handleRecords(service *Service) gin.HandlerFunc {
	return func(context *gin.Context) {
		query := context.Request.URL.Query()
		var jsonRows []*Record
		if len(query) == 0 {
			records, _ := service.FetchAllRecords()
			jsonRows = records
		} else {
			intervalStart, _ := time.Parse(time.RFC3339, query.Get("start"))
			intervalEnd, _ := time.Parse(time.RFC3339, query.Get("end"))
			log.Debugf("requested logs from %v to %v", intervalStart, intervalEnd)
			records, err := service.FetchRecords(int(intervalStart.UTC().Unix()), int(intervalEnd.UTC().Unix()))
			jsonRows = records
			if err != nil {
				context.Status(http.StatusInternalServerError)
				return
			}
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
