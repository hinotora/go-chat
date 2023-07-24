# syntax=docker/dockerfile:1

FROM golang:1.20-alpine

WORKDIR /app

COPY . ./

EXPOSE 80

# Run
CMD ["go", "run", "main.go"]