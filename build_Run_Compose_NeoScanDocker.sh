#!/bin/bash
echo "Calling docker compose for building privnet with neoscan";
(cd docker-neo-scan; docker-compose up -d)
