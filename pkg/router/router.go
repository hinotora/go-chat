package router

import (
	"fmt"
	"net/http"

	"github.com/hinotora/applicaton/pkg/config"
	"github.com/hinotora/applicaton/pkg/worker"
)

func Run() error {
	mux := http.NewServeMux()

	// Статическая страница, веб чата
	mux.Handle("/", http.FileServer(http.Dir("./static")))

	// Хэндлер сокета
	mux.HandleFunc("/socket", worker.OpenWebsocket)

	err := http.ListenAndServe(fmt.Sprintf(":%d", config.Instance.Application.Port), mux)

	return err
}
