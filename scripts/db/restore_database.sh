#!/usr/bin/bash

sudo docker exec \
-i "$DEV_CONTAINER" /bin/bash \
-c "psql -U postgres ${DEV_DB_NAME}" < "backup/db/$1"