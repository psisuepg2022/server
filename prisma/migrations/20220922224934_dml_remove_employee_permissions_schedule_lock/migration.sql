-- This is an empty migration.

DO
$$
BEGIN

	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'CREATE_SCHEDULE_LOCK' AND "role_id" = 3) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 3 AND "name" = 'CREATE_SCHEDULE_LOCK';
	END IF;

	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_SCHEDULE_LOCK' AND "role_id" = 3) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 3 AND "name" = 'DELETE_SCHEDULE_LOCK';
	END IF;

END
$$;
