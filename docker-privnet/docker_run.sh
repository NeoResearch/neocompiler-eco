#!/bin/bash
#
# Start a Docker container which runs the four consensus nodes. If it is
# already running, it will be destroyed first.
#
CONTAINER_NAME="neo-compiler-privnet-with-gas"
CONTAINER=$(docker ps -aqf name=$CONTAINER_NAME)

if [ -n "$CONTAINER" ]; then
	echo "Stopping container named $CONTAINER_NAME"
	docker stop $CONTAINER_NAME 1>/dev/null
fi


echo "Starting container..."
docker run -d --name $CONTAINER_NAME --rm -p 20333-20336:20333-20336/tcp -p 30333-30336:30333-30336/tcp $CONTAINER_NAME

# open wallet example:
# python3 unsafeprompt.py -p -e 6f70656e2077616c6c65742077312e77616c6c65740a

