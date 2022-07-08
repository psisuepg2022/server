-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "role" WHERE "name" = 'OWNER') THEN 	
		INSERT INTO "role" ("name") VALUES('OWNER');
	END IF;

	IF NOT EXISTS(SELECT * FROM "role" WHERE "name" = 'PROFESSIONAL') THEN 	
		INSERT INTO "role" ("name") VALUES('PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "role" WHERE "name" = 'EMPLOYEE') THEN 	
		INSERT INTO "role" ("name") VALUES('EMPLOYEE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "role" WHERE "name" = 'PATIENT') THEN 	
		INSERT INTO "role" ("name") VALUES('PATIENT');
	END IF;

END
$$;