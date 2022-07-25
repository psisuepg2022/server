-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_APPOINTMENTS' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'READ_APPOINTMENTS');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_PROFESSIONAL' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'CREATE_PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_PROFESSIONAL' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'READ_PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_PROFESSIONAL' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'UPDATE_PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_PROFESSIONAL' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'UNACTIVATE_PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_EMPLOYEE' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'CREATE_EMPLOYEE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_EMPLOYEE' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'READ_EMPLOYEE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_EMPLOYEE' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'UPDATE_EMPLOYEE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_EMPLOYEE' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'UNACTIVATE_EMPLOYEE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_PATIENT' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'CREATE_PATIENT');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_PATIENT' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'READ_PATIENT');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_PATIENT' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'UPDATE_PATIENT');
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_PATIENT' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'UNACTIVATE_PATIENT');
	END IF;

END
$$;
