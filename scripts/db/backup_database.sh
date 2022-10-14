#!/usr/bin/bash

cd backup/db && \
sudo docker exec -t "$DEV_CONTAINER" \
pg_dump "$DATABASE_URL" > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql