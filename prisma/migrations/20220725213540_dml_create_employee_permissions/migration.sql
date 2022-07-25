-- This is an empty migration.

DO
$$
BEGIN

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_APPOINTMENTS' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_APPOINTMENTS');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_APPOINTMENTS' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'UPDATE_APPOINTMENTS');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_PROFESSIONAL' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_PATIENT' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'CREATE_PATIENT');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_PATIENT' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_PATIENT');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_PATIENT' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'UPDATE_PATIENT');
	END IF;

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_WEEKLY_SCHEDULE' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_WEEKLY_SCHEDULE');
	END IF;

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_WEEKLY_SCHEDULE_LOCK' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_WEEKLY_SCHEDULE_LOCK');
	END IF;

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_SCHEDULE_LOCK' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'READ_SCHEDULE_LOCK');
	END IF;
END
$$;
