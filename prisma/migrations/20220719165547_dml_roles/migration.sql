-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "role" WHERE "nome" = 'OWNER') THEN 	
		INSERT INTO "role" ("nome") VALUES('OWNER');
	END IF;

	IF NOT EXISTS(SELECT * FROM "role" WHERE "nome" = 'PROFESSIONAL') THEN 	
		INSERT INTO "role" ("nome") VALUES('PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "role" WHERE "nome" = 'EMPLOYEE') THEN 	
		INSERT INTO "role" ("nome") VALUES('EMPLOYEE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "role" WHERE "nome" = 'PATIENT') THEN 	
		INSERT INTO "role" ("nome") VALUES('PATIENT');
	END IF;

END
$$;