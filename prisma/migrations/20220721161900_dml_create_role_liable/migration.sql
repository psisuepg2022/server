-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "role" WHERE "name" = 'LIABLE') THEN 	
		INSERT INTO "role" ("name") VALUES('LIABLE');
	END IF;

END
$$;