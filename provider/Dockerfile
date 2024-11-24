FROM golang:1.23-alpine
RUN go install github.com/air-verse/air@latest
WORKDIR /usr/app
COPY . .
EXPOSE 8080
CMD ["air", "-c", "air.toml"]
