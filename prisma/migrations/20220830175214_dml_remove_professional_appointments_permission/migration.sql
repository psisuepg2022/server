-- This is an empty migration.

DO
$$
BEGIN

	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'READ_APPOINTMENTS' AND "role_id" = 2) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 2 AND "name" = 'READ_APPOINTMENTS';
	END IF;

	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_APPOINTMENTS' AND "role_id" = 2) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 2 AND "name" = 'UPDATE_APPOINTMENTS';
	END IF;

END
$$;
