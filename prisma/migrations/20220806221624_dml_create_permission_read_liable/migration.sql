-- This is an empty migration.-- This is an empty migration.

DO
$$
BEGIN

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_LIABLE' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_LIABLE');
	END IF;

END
$$;
