# Introduction

This contains a Docker-Compose file modified from [neo-scan-docker](git@github.com:slipo/neo-scan-docker.git).

`docker-compose.yml` is a a fully working private network with neo-scan connected to it. It uses prebuilt images.
It was modified in order to handle NeoCompiler.io specific private net.

Start up the container in a detached mode
```
docker-compose up -d
```

Fell free to take is down
```
docker-compose down
```

However, consider stopping and restarting
```
docker-compose stop
docker-compose start
```
