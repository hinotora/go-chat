# syntax=docker/dockerfile:1

FROM golang:1.20-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . ./

# Build
RUN go build -o /chat

EXPOSE 80

# Run
CMD ["/chat"]