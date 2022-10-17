#!/usr/bin/bash

sudo docker exec -it "$DEV_CONTAINER" \
psql -U postgres \
-c "DROP DATABASE ${DEV_DB_NAME};" && \
sudo docker exec -it "$DEV_CONTAINER" \
psql -U postgres \
-c "CREATE DATABASE ${DEV_DB_NAME};"