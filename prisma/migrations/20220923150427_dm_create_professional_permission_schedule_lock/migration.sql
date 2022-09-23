-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'DELETE_SCHEDULE_LOCK');
	END IF;

END
$$;
