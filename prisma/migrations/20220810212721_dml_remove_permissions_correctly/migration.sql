-- This is an empty migration.

DO
$$
BEGIN

	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_PROFESSIONAL' AND "role_id" = 1) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 1 AND "name" = 'UNACTIVATE_PROFESSIONAL';
	END IF;

	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_EMPLOYEE' AND "role_id" = 1) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 1 AND "name" = 'UNACTIVATE_EMPLOYEE';
	END IF;

	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'UNACTIVATE_PATIENT' AND "role_id" = 1) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 1 AND "name" = 'UNACTIVATE_PATIENT';
	END IF;

  IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'UPDATE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 2 AND "name" = 'UPDATE_SCHEDULE_LOCK';
	END IF;

  IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 2 AND "name" = 'DELETE_SCHEDULE_LOCK';
	END IF;
  
	IF EXISTS(SELECT * FROM "permission" WHERE "name" = 'DELETE_SCHEDULE_LOCK' AND "role_id" = 2) THEN 	
		DELETE FROM "permission" WHERE "role_id" = 2 AND "name" = 'DELETE_SCHEDULE_LOCK';
	END IF;

END
$$;
