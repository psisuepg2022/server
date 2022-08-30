#!/usr/bin/bash

sudo docker stop "$DEV_CONTAINER" \
&& sudo docker start "$DEV_CONTAINER" \
&& sudo docker exec -it "$DEV_CONTAINER" psql -U postgres -c "DROP DATABASE ${DEV_DB_NAME};" \
&& yarn prisma:migrate:dev