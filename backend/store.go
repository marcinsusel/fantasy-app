package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	bolt "go.etcd.io/bbolt"
)

const (
	dbName     = "fantasy.db"
	bucketName = "squads"
)

type Store struct {
	db *bolt.DB
}

type Squad struct {
	ID        string    `json:"id"`
	Players   []Player  `json:"players"`
	CreatedAt time.Time `json:"createdAt"`
}

type Player struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Position string  `json:"position"` // "GK", "DEF", "MID", "FWD"
	Team     string  `json:"team"`
	Cost     float64 `json:"cost"`
}

func NewStore() (*Store, error) {
	db, err := bolt.Open(dbName, 0600, nil)
	if err != nil {
		return nil, fmt.Errorf("could not open db: %v", err)
	}

	err = db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(bucketName))
		return err
	})
	if err != nil {
		return nil, fmt.Errorf("could not create bucket: %v", err)
	}

	return &Store{db: db}, nil
}

func (s *Store) Close() error {
	return s.db.Close()
}

func (s *Store) SaveSquad(players []Player) (string, error) {
	id := uuid.New().String()
	squad := Squad{
		ID:        id,
		Players:   players,
		CreatedAt: time.Now(),
	}

	data, err := json.Marshal(squad)
	if err != nil {
		return "", err
	}

	err = s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		return b.Put([]byte(id), data)
	})

	if err != nil {
		return "", err
	}

	return id, nil
}

func (s *Store) GetSquad(id string) (*Squad, error) {
	var squad Squad

	err := s.db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		data := b.Get([]byte(id))
		if data == nil {
			return fmt.Errorf("squad not found")
		}
		return json.Unmarshal(data, &squad)
	})

	if err != nil {
		return nil, err
	}

	return &squad, nil
}
