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
	r.GET("/stats", handleStats)
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

func handleStats(context *gin.Context) {
	query := context.Request.URL.Query()
	contextDb, _ := context.Get("db")
	contextLogger, _ := context.Get("log")
	db := contextDb.(*sql.DB)
	logger := contextLogger.(*zap.SugaredLogger)
	var jsonRows []*Stat
	if query != nil {
		stats, _ := FetchAllStats(db, logger)
		jsonRows = stats
	} else {
		intervalStart, _ := strconv.Atoi(query.Get("startInterval"))
		intervalEnd, _ := strconv.Atoi(query.Get("endInterval"))
		stats, err := FetchStats(db, logger, intervalStart, intervalEnd)
		jsonRows = stats
		if err != nil {
			context.Status(http.StatusInternalServerError)
			return
		}
	}
	context.JSON(http.StatusOK, jsonRows)
}
