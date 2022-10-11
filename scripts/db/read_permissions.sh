#!/usr/bin/bash

sudo docker exec -it "$DEV_CONTAINER" \
psql -U postgres "$DEV_DB_NAME" \
-c "SELECT p.nome as permissao, r.nome as papel_usuario FROM permissoes p INNER JOIN papel_usuario r ON p.id_papel_usuario = r.id;"