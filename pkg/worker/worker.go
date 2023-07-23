package worker

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/hinotora/applicaton/pkg/message"
	"github.com/hinotora/applicaton/pkg/redis"
)

var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var Nickname string = ""
var BaseCloseHandler func(code int, text string) error

func OpenWebsocket(w http.ResponseWriter, r *http.Request) {
	connection, err := Upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println(err)
	}

	BaseCloseHandler = connection.CloseHandler()
	Nickname = "Unknown user"

	cookie, err := r.Cookie("CURRENT_NICKNAME")

	if err == nil {
		s := strings.Split(cookie.String(), "=")

		Nickname = s[1]
	}

	connection.SetCloseHandler(OnClose)

	log.Printf("Openned new connection with [%s] / [%s]", connection.RemoteAddr().String(), Nickname)

	go Writer(connection)
	go Sender(connection)

	time.Sleep(250 * time.Millisecond)

	OnConnect(Nickname)
}

func Writer(conn *websocket.Conn) {
	for {
		// Прочитали сообщение
		_, p, err := conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Unexpected: %v", err)
			} else {
				log.Println(err)
			}

			break
		}

		payload := string(p)

		log.Printf("INCOMMING FROM [%s] %s", conn.RemoteAddr().String(), payload)

		redisErr := redis.Instance.Client.Publish(context.TODO(), "chat", payload).Err()

		if redisErr != nil {
			log.Println(redisErr.Error())
		}
	}
}

func Sender(conn *websocket.Conn) {
	pubsub := redis.Instance.Client.Subscribe(context.TODO(), "chat")

	defer pubsub.Close()

	for {
		msg, err := pubsub.ReceiveMessage(context.TODO())

		if err != nil {
			log.Println(err)
		}

		// Отвечаем на сообщение обратно браузеру
		if err := conn.WriteMessage(1, []byte(msg.Payload)); err != nil {
			log.Println(err)

			return
		}

		log.Printf("OUTGOING TO [%s] %s", conn.RemoteAddr().String(), msg.Payload)
	}
}

func OnConnect(nickname string) {
	msgText := fmt.Sprintf("%s entered chat", nickname)

	msg := message.NewMessage(nickname, msgText, "info")

	t, _ := json.Marshal(msg)

	redis.Instance.Client.Publish(context.TODO(), "chat", t).Err()
}

func OnClose(code int, text string) error {

	msgText := fmt.Sprintf("%s left chat", Nickname)

	msg := message.NewMessage(Nickname, msgText, "info")

	t, _ := json.Marshal(msg)

	redis.Instance.Client.Publish(context.TODO(), "chat", t).Err()

	BaseCloseHandler(code, text)

	return errors.New(text)
}
