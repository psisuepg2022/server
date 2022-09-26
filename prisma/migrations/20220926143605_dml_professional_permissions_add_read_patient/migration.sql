-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_PATIENT' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'READ_PATIENT');
	END IF;

END
$$;
