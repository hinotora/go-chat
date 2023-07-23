package redis

import (
	"fmt"
	"strconv"

	"github.com/hinotora/applicaton/pkg/config"
	r "github.com/redis/go-redis/v9"
)

type Redis struct {
	Client *r.Client
}

var Instance *Redis = nil

func Load(config *config.Config) {
	if Instance == nil {
		redis := &Redis{}

		redis.Client = r.NewClient(&r.Options{
			Addr: fmt.Sprintf("%s:%s", config.Redis.Host, strconv.Itoa(int(config.Redis.Port))),
		})

		Instance = redis
	}
}
