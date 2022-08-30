#!/usr/bin/bash

cd backup/db && \
sudo docker exec -t "$DEV_CONTAINER" \
pg_dump -c -h localhost -U postgres \
"$DEV_DB_NAME" > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql