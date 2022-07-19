-- This is an empty migration.

-- CreateCheck
ALTER TABLE "pessoa" ADD CONSTRAINT pessoa_check_nascimento CHECK ("data_nascimento" < CURRENT_TIMESTAMP);

-- CreateCheck
ALTER TABLE "paciente" ADD CONSTRAINT paciente_check_sexo CHECK ("sexo" IN (1, 2, 3, 4, 5));

-- CreateCheck
ALTER TABLE "paciente" ADD CONSTRAINT paciente_check_estado_civil CHECK ("estado_civil" IN (1, 2, 3, 4));