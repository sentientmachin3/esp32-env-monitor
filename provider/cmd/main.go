package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/mattn/go-sqlite3"
)

func main() {
	dbPath := os.Getenv("DATABASE_PATH")
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from Go with SQLite!")
	})
	http.ListenAndServe(":3080", nil)
}
