package main

import "go.uber.org/zap"

var log *zap.SugaredLogger

func InitLogger() {
	loggingConfig := zap.NewDevelopmentConfig()
	builtLogger, _ := loggingConfig.Build()
	log = builtLogger.Sugar()
}
