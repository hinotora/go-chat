package config

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

type Config struct {
	Application struct {
		Url  string `json:"url"`
		Port int16  `json:"port"`
		Env  string `json:"environment"`
	} `json:"app"`
	Redis struct {
		Host string `json:"host"`
		Port int16  `json:"port"`
	} `json:"redis"`
}

var Instance *Config = nil

var ConfigFileName string = "config.json"

func Load() error {
	if Instance != nil {
		return nil
	}

	jsonFile, err := os.Open(ConfigFileName)

	if err != nil {
		return err
	}

	defer jsonFile.Close()

	byteJson, _ := ioutil.ReadAll(jsonFile)

	config := &Config{}

	err = json.Unmarshal(byteJson, config)

	if err != nil {
		return err
	}

	Instance = config

	return nil
}
