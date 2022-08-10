-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_SCHEDULE_LOCK' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'CREATE_SCHEDULE_LOCK');
	END IF;

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_SCHEDULE_LOCK' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'DELETE_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_SCHEDULE_LOCK' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_SCHEDULE_LOCK');
	END IF;


  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 2 AND "name" = 'UPDATE_SCHEDULE_LOCK';
	END IF;

END
$$;
