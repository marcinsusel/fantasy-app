package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

func main() {
	store, err := NewStore()
	if err != nil {
		log.Fatal(err)
	}
	defer store.Close()

	http.HandleFunc("/api/squads", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "POST" {
			var players []Player
			if err := json.NewDecoder(r.Body).Decode(&players); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			id, err := store.SaveSquad(players)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"id": id})
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	http.HandleFunc("/api/squads/", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "GET" {
			id := strings.TrimPrefix(r.URL.Path, "/api/squads/")
			if id == "" {
				http.Error(w, "Missing ID", http.StatusBadRequest)
				return
			}

			squad, err := store.GetSquad(id)
			if err != nil {
				http.Error(w, err.Error(), http.StatusNotFound)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(squad)
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	log.Println("Server starting on :8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
