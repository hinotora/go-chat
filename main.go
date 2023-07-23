package main

import (
	"log"

	"github.com/hinotora/applicaton/pkg/config"
	"github.com/hinotora/applicaton/pkg/redis"
	"github.com/hinotora/applicaton/pkg/router"
)

func main() {
	err := config.Load()

	if err != nil {
		log.Fatal(err)
	}

	redis.Load(config.Instance)

	err = router.Run()

	log.Fatal(err)
}
