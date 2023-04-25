# bullmq-dash

This is a simple docker container which hosts a BullMQ bull-board.

## Docker Compose Example

Here's an example docker compose file which sets this up:

```yaml
version: "3.9"
services:
  redis:
    image: redis:alpine
    ports: [6379:6379]
  bullboard:
    image: mikehock/bull-board:0.1.0
    ports: [8008:8008]
    environment:
      PORT: "8008"
      QUEUE_NAMES: "myQueue,anotherQueue"
      REDIS_HOST: redis
      REDIS_PORT: "6379"
```

## Configuration

- `PORT`: the port the bull-board should be hosted on.
- `QUEUE_NAMES`: a comma-separated list of bullmq queue names which should be loaded into the board.
- `REDIS_HOST`: redis hostname
- `REDIS_PORT`: redis port

Authenticated redis connections aren't supported at this time.
