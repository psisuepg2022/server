-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "permissoes" WHERE "nome" = 'READ_LIABLE' AND "id_papel_usuario" = 1) THEN 	
		INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'READ_LIABLE');
	END IF;

END
$$;