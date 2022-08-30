#!/usr/bin/bash

sudo docker exec -it "$DEV_CONTAINER" \
psql -U postgres "$DEV_DB_NAME" \
-c "SELECT p.name as permission, r.name as role FROM permission p INNER JOIN role r ON p.role_id = r.id;"