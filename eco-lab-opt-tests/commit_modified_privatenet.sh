#!/bin/bash
# $1 https repo of neo to test
# $2 branch of neo repo to test

# use docker to publish neo
#TODO sub in $1 $2

CONTAINER_NAME="neo-privatenet-opt-tests"
CONTAINER_NEOPRIVNET="neo-privnet"
CONTAINER=$(docker ps -aqf name=$CONTAINER_NAME)
if [ -n "$CONTAINER" ]; then
	echo "Stopping container named $CONTAINER_NAME"
	docker stop $CONTAINER_NAME 1>/dev/null
fi

echo "Building & running neo-publish & copying.zip"
(cd docker-build-neo-cli; ./docker_build_run_copy_stop.sh)


#echo "Cloning latest neo-privatenet-docker repo..."
#NeoResearch repo is used for a better control of stability of this project
#git clone https://github.com/NeoResearch/neo-privatenet-docker.git

cd neo-privatenet-docker/
echo "Git pull neoprivatenet docker..."
git pull
echo "Git checkout master..."
git checkout master

echo "Removing existing privatenet files and images..."
#rm -rf ./neo-privatenet-docker
CONTAINER=$(docker ps -aqf name=neo-privnet)
if [ -n "$CONTAINER" ]; then
	echo "Stopping container named neo-privnet"
	docker stop $CONTAINER_NEOPRIVNET 1>/dev/null
	echo "Removing container named neo-privnet"
	docker rm $CONTAINER_NEOPRIVNET 1>/dev/null
fi
#docker rmi neo-privnet

echo "Building docker privatenet with new neo-cli..."
./docker_build.sh --neo-cli ../docker-build-neo-cli/neo-cli-built.zip

echo "Running Privatenet and claiming GAS..."
./docker_run_and_create_wallet.sh
#./docker_run.sh

echo "Create a docker image at this point"
cd ..
CONTAINER=$(docker ps -aqf name=$CONTAINER_NEOPRIVNET)
if [ -n "$CONTAINER" ]; then
	echo "Stopping container named neo-privnet"
	docker stop $CONTAINER_NEOPRIVNET 1>/dev/null
	echo "Taking image of container named neo-privnet"
	docker commit $CONTAINER $CONTAINER_NAME
	echo "Removing container named neo-privnet"
	docker rm $CONTAINER_NEOPRIVNET 1>/dev/null
fi

echo "Bye bye script setup_test_image.sh"
