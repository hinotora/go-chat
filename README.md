# Websocket broadcast chat built with Golang and Redis

Just a simple pet project for better understanding Golang, Websocket and Redis (pub/sub). Communication between all users connected to chat, it supports obly text messages with separated by nickname and info messages (User entered\left chat)

## Requirements

Application ready-to-go with docker compose plugin

1. Docker & Docker-compose

## Configuration

```sh
 
# Clone this repo to a local/remote machine
$ git clone https://github.com/hinotora/go-chat.git

# Cd to a folder
$ cd go-chat

# Unpack config from example one
$ cp config.json.example config.json

```

Than edit `.env` file

```text
APP_CONTAINER_NAME=chat     # application name (container name)
APP_EXTERNAL_PORT=7654      # external port for application
```

## Usage

```sh

# Just run docker compose and enjoy
$ docker compose up -d 

```

Then enter `127.0.0.1:7654` in your browser search. (Or `other port` if you changed it)

### Demo:

Type your nickname in input field and click `Connect`.
Now you can write and send some messages.
Open another browser tab (or other browser, or incognito mode) and do same steps. Now you can communicate between the tabs ;)

![](https://github.com/hinotora/go-chat/blob/master/docs/demo.gif)

### License

Nah, do whatever you want, but can you create link on this repo if want to use it public? 👉👈