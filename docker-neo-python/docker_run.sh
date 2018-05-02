#!/bin/bash
#
# Start a Docker container which runs the four consensus nodes. If it is
# already running, it will be destroyed first.
#
CONTAINER_NAME="neo-compiler-neo-python"
CONTAINER=$(docker ps -aqf name=$CONTAINER_NAME)

if [ -n "$CONTAINER" ]; then
	echo "Stopping container named $CONTAINER_NAME"
	docker stop $CONTAINER_NAME 1>/dev/null
fi

echo "Starting container..."
docker run -d --name $CONTAINER_NAME --rm -p 30337:30337/tcp -p 38088:38088/tcp -h $CONTAINER_NAME $CONTAINER_NAME
