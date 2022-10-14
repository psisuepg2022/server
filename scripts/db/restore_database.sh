#!/usr/bin/bash

sudo docker exec \
-i "$DEV_CONTAINER" /bin/bash \
-c "psql ${DATABASE_URL}" < "backup/db/$1"