-- This is an empty migration.-- This is an empty migration.

DO
$$
BEGIN

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_PROFESSIONAL' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'DELETE_PROFESSIONAL');
	END IF;

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_EMPLOYEE' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'DELETE_EMPLOYEE');
	END IF;

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_PATIENT' AND "role_id" = 1) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(1, 'DELETE_PATIENT');
	END IF;

  IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_PATIENT' AND "role_id" = 3) THEN 	
		INSERT INTO "permission" ("role_id", "name") VALUES(3, 'DELETE_PATIENT');
	END IF;

END
$$;
