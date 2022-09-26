-- This is an empty migration.

DO
$$
BEGIN

	IF EXISTS(SELECT * FROM "role" WHERE "name" = 'PATIENT') THEN 	
		DELETE FROM "role" WHERE "name" = 'PATIENT';
	END IF;

	IF EXISTS(SELECT * FROM "role" WHERE "name" = 'LIABLE') THEN 	
		DELETE FROM "role" WHERE "name" = 'LIABLE';
	END IF;

END
$$;