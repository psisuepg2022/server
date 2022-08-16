-- This is an empty migration.

DO
$$
BEGIN

	IF NOT EXISTS(SELECT * FROM "papel_usuario" WHERE "nome" = 'OWNER') THEN 	
		INSERT INTO "papel_usuario" ("nome") VALUES('OWNER');
	END IF;

	IF NOT EXISTS(SELECT * FROM "papel_usuario" WHERE "nome" = 'PROFESSIONAL') THEN 	
		INSERT INTO "papel_usuario" ("nome") VALUES('PROFESSIONAL');
	END IF;

	IF NOT EXISTS(SELECT * FROM "papel_usuario" WHERE "nome" = 'EMPLOYEE') THEN 	
		INSERT INTO "papel_usuario" ("nome") VALUES('EMPLOYEE');
	END IF;

	IF NOT EXISTS(SELECT * FROM "papel_usuario" WHERE "nome" = 'PATIENT') THEN 	
		INSERT INTO "papel_usuario" ("nome") VALUES('PATIENT');
	END IF;

END
$$;