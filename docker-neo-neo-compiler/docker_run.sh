#!/bin/bash
IMAGE_NAME="docker-neo-neo-compiler"

git clone https://github.com/neo-project/neo.git neo-code

echo "Starting container..."
#docker run --rm --volume neo-code:/neo-code --name $IMAGE_NAME -it /bin/bash
docker run --rm --volume=`pwd`/neo-code:/neo-code docker-neo-neo-compiler -t

cp neo-code/build/* .
