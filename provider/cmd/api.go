package main

import (
	"net/http"
	"strconv"

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
			intervalStart, _ := strconv.Atoi(query.Get("start"))
			intervalEnd, _ := strconv.Atoi(query.Get("end"))
			records, err := service.FetchRecords(intervalStart, intervalEnd)
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
