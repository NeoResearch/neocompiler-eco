#!/bin/bash
if (( $# == 0 )); then
	echo "Ensuring docker compose neo-scan is down";
	(cd ./docker-neo-scan; docker-compose -f docker-compose-dev.yml down)
	echo "Building docker compose neo-scan";
	(cd ./docker-neo-scan; docker-compose -f docker-compose-dev.yml build)
	echo "Calling docker compose for building privnet with neoscan";
	(cd ./docker-neo-scan; docker-compose -f docker-compose-dev.yml up --rm)
else
	echo "Calling docker compose, inside docker-neo-scan folder, with parameter $1";
	(cd ./docker-neo-scan; docker-compose -f docker-compose-dev.yml $1)
fi
