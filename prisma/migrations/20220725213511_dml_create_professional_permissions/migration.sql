-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_PROFESSIONAL' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'UPDATE_PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_WEEKLY_SCHEDULE' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'CREATE_WEEKLY_SCHEDULE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_WEEKLY_SCHEDULE' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'READ_WEEKLY_SCHEDULE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_WEEKLY_SCHEDULE' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'UPDATE_WEEKLY_SCHEDULE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_WEEKLY_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'CREATE_WEEKLY_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_WEEKLY_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'DELETE_WEEKLY_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_WEEKLY_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'READ_WEEKLY_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_WEEKLY_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'UPDATE_WEEKLY_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'CREATE_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'DELETE_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'READ_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'UPDATE_SCHEDULE_LOCK');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_COMMENTS' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'CREATE_COMMENTS');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_COMMENTS' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'READ_COMMENTS');
	END IF;
	
	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_APPOINTMENTS' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'READ_APPOINTMENTS');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_APPOINTMENTS' AND "role_id" = 2) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(2, 'UPDATE_APPOINTMENTS');
	END IF;

END
$$;
