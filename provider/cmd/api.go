package main

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func SetupRoutes(r *gin.Engine, logger *zap.SugaredLogger, db *sql.DB) {
	r.Use(logWrapper(logger))
	r.Use(dbConnWrapper(db))
	r.GET("/records", handleRecords)
}

func logWrapper(logger *zap.SugaredLogger) gin.HandlerFunc {
	return func(context *gin.Context) {
		logger.Infoln(strings.ToUpper(context.Request.Method), context.Request.URL)
		context.Set("log", logger)
	}
}

func dbConnWrapper(db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Set("db", db)
	}
}

func handleRecords(context *gin.Context) {
	query := context.Request.URL.Query()
	contextDb, _ := context.Get("db")
	contextLogger, _ := context.Get("log")
	db := contextDb.(*sql.DB)
	logger := contextLogger.(*zap.SugaredLogger)
	var jsonRows []*Record
	if query == nil {
		records, _ := FetchAllRecords(db, logger)
		jsonRows = records
	} else {
		intervalStart, _ := strconv.Atoi(query.Get("start"))
		intervalEnd, _ := strconv.Atoi(query.Get("end"))
		records, err := FetchRecords(db, logger, intervalStart, intervalEnd)
		jsonRows = records
		if err != nil {
			context.Status(http.StatusInternalServerError)
			return
		}
	}
	context.JSON(http.StatusOK, jsonRows)
}
