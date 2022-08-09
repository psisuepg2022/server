-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_PROFESSIONAL' AND "role_id" = 1) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 1 AND "name" = 'UNACTIVATE_PROFESSIONAL';
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_EMPLOYEE' AND "role_id" = 1) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 1 AND "name" = 'UNACTIVATE_EMPLOYEE';
	END IF;

	IF NOT EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_PATIENT' AND "role_id" = 1) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 1 AND "name" = 'UNACTIVATE_PATIENT';
	END IF;

END
$$;
