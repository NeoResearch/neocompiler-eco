#!/bin/bash
if (( $# == 0 )); then
	echo "Calling docker compose for building privnet with neoscan";
	(cd ./docker-neo-scan; docker-compose up -d)
else
	echo "Calling docker compose, inside docker-neo-scan folder, with parameter $1";
	(cd ./docker-neo-scan; docker-compose $1)
fi
