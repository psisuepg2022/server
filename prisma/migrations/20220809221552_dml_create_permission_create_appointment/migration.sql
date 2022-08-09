-- This is an empty migration.

DO
$$
BEGIN

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_APPOINTMENT' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'CREATE_APPOINTMENT');
	END IF;

END
$$;
