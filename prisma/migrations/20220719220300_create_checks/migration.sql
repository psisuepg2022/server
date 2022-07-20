-- This is an empty migration.

-- CreateCheck
ALTER TABLE "pessoa" ADD CONSTRAINT pessoa_check_nascimento CHECK ("data_nascimento" < CURRENT_TIMESTAMP);

-- CreateCheck
ALTER TABLE "paciente" ADD CONSTRAINT paciente_check_sexo CHECK ("sexo" IN (1, 2, 3, 4, 5));

-- CreateCheck
ALTER TABLE "paciente" ADD CONSTRAINT paciente_check_estado_civil CHECK ("estado_civil" IN (1, 2, 3, 4));

-- CreateCheck
ALTER TABLE "agenda_semanal" ADD CONSTRAINT agenda_semanal_check_dia_semana CHECK ("dia_semana" IN (1, 2, 3, 4, 5, 6, 7));

-- CreateCheck
ALTER TABLE "agenda_semanal" ADD CONSTRAINT agenda_semanal_check_horario CHECK ("horario_inicio" < "horario_fim");

-- CreateCheck
ALTER TABLE "restricoes_horario" ADD CONSTRAINT restricoes_horario_check_horario CHECK ("horario_inicio" < "horario_fim");

-- CreateCheck
ALTER TABLE "restricoes_horario" ADD CONSTRAINT restricoes_horario_check_data CHECK ("data" < CURRENT_TIMESTAMP);

-- CreateCheck
ALTER TABLE "restricoes_agenda_semanal" ADD CONSTRAINT restricoes_agenda_semanal_check_horario CHECK ("horario_inicio" < "horario_fim");