/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `liable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `professional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule_lock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weekly_schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weekly_schedule_lock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_person_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "liable" DROP CONSTRAINT "liable_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "liable" DROP CONSTRAINT "liable_person_id_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "person" DROP CONSTRAINT "person_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_lock" DROP CONSTRAINT "schedule_lock_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- DropForeignKey
ALTER TABLE "weekly_schedule" DROP CONSTRAINT "weekly_schedule_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "weekly_schedule_lock" DROP CONSTRAINT "weekly_schedule_lock_weekly_schedule_id_fkey";

-- DropTable
DROP TABLE "address";

-- DropTable
DROP TABLE "appointment";

-- DropTable
DROP TABLE "clinic";

-- DropTable
DROP TABLE "liable";

-- DropTable
DROP TABLE "patient";

-- DropTable
DROP TABLE "permission";

-- DropTable
DROP TABLE "person";

-- DropTable
DROP TABLE "professional";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "schedule_lock";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "weekly_schedule";

-- DropTable
DROP TABLE "weekly_schedule_lock";

-- CreateTable
CREATE TABLE "clinica" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "codigo_base" SERIAL NOT NULL,

    CONSTRAINT "clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100),
    "nome" VARCHAR(100) NOT NULL,
    "classe_dominio" VARCHAR(32) NOT NULL,
    "cpf" VARCHAR(11),
    "data_nascimento" DATE NOT NULL,
    "telefone" VARCHAR(11),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_clinica" UUID NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" UUID NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "bairro" VARCHAR(100),
    "estado" VARCHAR(100) NOT NULL,
    "logradouro" VARCHAR(255) NOT NULL,
    "CEP" VARCHAR(8) NOT NULL,
    "id_pessoa" UUID NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "nome_usuario" VARCHAR(100) NOT NULL,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "senha" VARCHAR(255) NOT NULL,
    "codigo_acesso" SERIAL NOT NULL,
    "id" UUID NOT NULL,
    "id_papel_usuario" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papel_usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(36) NOT NULL,

    CONSTRAINT "papel_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(36) NOT NULL,
    "id_papel_usuario" INTEGER NOT NULL,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paciente" (
    "genero" SMALLINT NOT NULL,
    "estado_civil" SMALLINT NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissional" (
    "profissao" VARCHAR(255) NOT NULL,
    "especializacao" VARCHAR(255),
    "duracao_base" INTEGER NOT NULL DEFAULT 60,
    "registro" VARCHAR(255) NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "profissional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsavel" (
    "id_pessoa" UUID NOT NULL,
    "id_paciente" UUID NOT NULL,

    CONSTRAINT "responsavel_pkey" PRIMARY KEY ("id_paciente")
);

-- CreateTable
CREATE TABLE "agenda_semanal" (
    "id" UUID NOT NULL,
    "horario_inicio" TIME NOT NULL,
    "horario_fim" TIME NOT NULL,
    "dia_semana" SMALLINT NOT NULL,
    "id_profissional" UUID NOT NULL,

    CONSTRAINT "agenda_semanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restricoes_agenda_semanal" (
    "id" UUID NOT NULL,
    "horario_inicio" TIME NOT NULL,
    "horario_fim" TIME NOT NULL,
    "id_agenda_semanal" UUID NOT NULL,

    CONSTRAINT "restricoes_agenda_semanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restricoes_horario" (
    "id" UUID NOT NULL,
    "horario_inicio" TIME NOT NULL,
    "horario_fim" TIME NOT NULL,
    "data" DATE NOT NULL,
    "id_profissional" UUID NOT NULL,

    CONSTRAINT "restricoes_horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulta" (
    "id" UUID NOT NULL,
    "situacao" SMALLINT NOT NULL,
    "data_agendamento" TIMESTAMP NOT NULL,
    "data_ultima_atualizacao" TIMESTAMP NOT NULL,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "id_paciente" UUID NOT NULL,
    "id_profissional" UUID NOT NULL,
    "id_funcionario" UUID NOT NULL,

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinica_email_key" ON "clinica"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_email_key" ON "pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_cpf_key" ON "pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "endereco_id_pessoa_key" ON "endereco"("id_pessoa");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nome_usuario_key" ON "usuario"("nome_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_id_key" ON "usuario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "papel_usuario_nome_key" ON "papel_usuario"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_id_key" ON "paciente"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profissional_id_key" ON "profissional"("id");

-- AddForeignKey
ALTER TABLE "pessoa" ADD CONSTRAINT "pessoa_id_clinica_fkey" FOREIGN KEY ("id_clinica") REFERENCES "clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_fkey" FOREIGN KEY ("id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_papel_usuario_fkey" FOREIGN KEY ("id_papel_usuario") REFERENCES "papel_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_id_papel_usuario_fkey" FOREIGN KEY ("id_papel_usuario") REFERENCES "papel_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_id_fkey" FOREIGN KEY ("id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissional" ADD CONSTRAINT "profissional_id_fkey" FOREIGN KEY ("id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel" ADD CONSTRAINT "responsavel_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_semanal" ADD CONSTRAINT "agenda_semanal_id_profissional_fkey" FOREIGN KEY ("id_profissional") REFERENCES "profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restricoes_agenda_semanal" ADD CONSTRAINT "restricoes_agenda_semanal_id_agenda_semanal_fkey" FOREIGN KEY ("id_agenda_semanal") REFERENCES "agenda_semanal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restricoes_horario" ADD CONSTRAINT "restricoes_horario_id_profissional_fkey" FOREIGN KEY ("id_profissional") REFERENCES "profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_id_profissional_fkey" FOREIGN KEY ("id_profissional") REFERENCES "profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateSequence
CREATE SEQUENCE gerar_codigo_clinica INCREMENT 1000 START 1000;

-- AlterTable
ALTER TABLE "clinica" ALTER COLUMN "codigo_base" SET DEFAULT nextval('gerar_codigo_clinica');

-- DropSequence
DROP SEQUENCE generate_clinic_code;

-- DropFunction
DROP FUNCTION create_user_code;

-- CreateTrigger
CREATE FUNCTION gerar_codigo_usuario() RETURNS TRIGGER
AS $$
DECLARE CODIGO_CLINICA BIGINT;
BEGIN
  SELECT c.codigo_base INTO CODIGO_CLINICA
  FROM clinica c
  WHERE c.id = (SELECT p.id_clinica FROM pessoa p WHERE p.id = NEW.id);

  NEW.codigo_acesso := NEW.codigo_acesso + CODIGO_CLINICA;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_gerar_codigo_usuario
BEFORE INSERT ON "usuario"
FOR EACH ROW
EXECUTE PROCEDURE gerar_codigo_usuario();

-- CreateCheck
ALTER TABLE "pessoa" 
  ADD CONSTRAINT pessoa_check_nascimento 
  CHECK ("data_nascimento" < CURRENT_TIMESTAMP);

-- CreateCheck
ALTER TABLE "paciente" 
  ADD CONSTRAINT paciente_check_genero 
  CHECK ("genero" IN (1, 2, 3, 4, 5));

-- CreateCheck
ALTER TABLE "paciente" 
  ADD CONSTRAINT paciente_check_estado_civil 
  CHECK ("estado_civil" IN (1, 2, 3, 4));

-- CreateCheck
ALTER TABLE "agenda_semanal" 
  ADD CONSTRAINT agenda_semanal_check_dia_semana 
  CHECK ("dia_semana" IN (1, 2, 3, 4, 5, 6, 7));

-- CreateCheck
ALTER TABLE "agenda_semanal" 
  ADD CONSTRAINT agenda_semanal_check_horario 
  CHECK ("horario_inicio" < "horario_fim");

-- CreateCheck
ALTER TABLE "restricoes_horario" 
  ADD CONSTRAINT restricoes_horario_check_horario 
  CHECK ("horario_inicio" < "horario_fim");

-- CreateCheck
ALTER TABLE "restricoes_horario" 
  ADD CONSTRAINT restricoes_horario_check_data 
  CHECK ("data" + "horario_inicio" > CURRENT_TIMESTAMP);

-- CreateCheck
ALTER TABLE "restricoes_agenda_semanal" 
  ADD CONSTRAINT restricoes_agenda_semanal_check_horario 
  CHECK ("horario_inicio" < "horario_fim");

-- CreateCheck
ALTER TABLE "consulta" 
  ADD CONSTRAINT consulta_check_situacao 
  CHECK ("situacao" IN (1, 2, 3, 4, 5));

-- CreateCheck
ALTER TABLE "consulta" 
  ADD CONSTRAINT consulta_check_data_agendamento 
  CHECK ("data_agendamento" > CURRENT_TIMESTAMP);

-- CreateCheck
ALTER TABLE "profissional" 
  ADD CONSTRAINT profissional_duracao_base_check 
  CHECK ("duracao_base" > 0);

-- CreateTrigger
CREATE FUNCTION previnir_consultas_mesmo_horario() RETURNS TRIGGER
AS $$
  DECLARE 
    DURACAO_CONSULTA INTEGER;
    ID_CONSULTA_EXISTENTE CHARACTER VARYING(36) := NULL;
BEGIN
  SELECT p.duracao_base INTO DURACAO_CONSULTA
  FROM profissional p 
  WHERE p.id = NEW.id_profissional;

  SELECT c.id INTO ID_CONSULTA_EXISTENTE
  FROM consulta c
  WHERE 
    c.id_profissional = NEW.id_profissional 
    AND c.situacao <> 4
    AND (
      (NEW.data_agendamento = c.data_agendamento)
      OR (
        NEW.data_agendamento > c.data_agendamento
        AND NEW.data_agendamento < (c.data_agendamento + (DURACAO_CONSULTA* interval '1 minute'))
      )
      OR (
        NEW.data_agendamento < c.data_agendamento
        AND (NEW.data_agendamento + (DURACAO_CONSULTA* interval '1 minute')) > c.data_agendamento
      )
    )
  LIMIT 1;

  IF (coalesce(ID_CONSULTA_EXISTENTE, '') <> '') THEN
    raise exception 'TRIGGER_RAISE_EXCEPTION_0';
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_previnir_consultas_mesmo_horario
BEFORE INSERT ON "consulta"
FOR EACH ROW
EXECUTE PROCEDURE previnir_consultas_mesmo_horario();

-- CreateTrigger
CREATE FUNCTION bloquear_consulta_fora_da_agenda_semanal() RETURNS TRIGGER
AS $$
  DECLARE 
    ID_AGENDA_SEMANAL_EXISTENTE CHARACTER VARYING(36) := NULL;
    ID_RESTRICAO_AGENDA_SEMANAL_EXISTENTE CHARACTER VARYING(36) := NULL;
BEGIN
  SELECT ag.id INTO ID_AGENDA_SEMANAL_EXISTENTE 
  FROM agenda_semanal ag
  WHERE 
    ag.id_profissional = NEW.id_profissional
    AND ag.dia_semana = ((extract(DOW FROM NEW.data_agendamento::TIMESTAMP)) + 1)
    AND (NEW.data_agendamento::TIME) < ag.horario_fim
    AND (NEW.data_agendamento::TIME) >= ag.horario_inicio;

  IF (coalesce(ID_AGENDA_SEMANAL_EXISTENTE, '') = '') THEN
    raise exception 'TRIGGER_RAISE_EXCEPTION_1';
  END IF;

  SELECT rag.id INTO ID_RESTRICAO_AGENDA_SEMANAL_EXISTENTE
  FROM restricoes_agenda_semanal rag
  WHERE
    rag.id_agenda_semanal = (ID_AGENDA_SEMANAL_EXISTENTE::UUID)
    AND (NEW.data_agendamento::TIME) < rag.horario_fim
    AND (NEW.data_agendamento::TIME) >= rag.horario_inicio; 

  IF (coalesce(ID_RESTRICAO_AGENDA_SEMANAL_EXISTENTE, '') <> '') THEN
    raise exception 'TRIGGER_RAISE_EXCEPTION_2';
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_bloquear_consulta_fora_da_agenda_semanal
BEFORE INSERT ON "consulta"
FOR EACH ROW
EXECUTE PROCEDURE bloquear_consulta_fora_da_agenda_semanal();

-- CreateTrigger
CREATE FUNCTION verificar_restricoes_horario_profissional() RETURNS TRIGGER
AS $$
  DECLARE 
    ID_RESTRICAO_HORARIO_EXISTENTE CHARACTER VARYING(36) := NULL;
BEGIN
  SELECT r.id INTO ID_RESTRICAO_HORARIO_EXISTENTE 
  FROM restricoes_horario r
  WHERE 
    r.id_profissional = NEW.id_profissional
    AND r.data = (NEW.data_agendamento::DATE)
    AND (NEW.data_agendamento::TIME) < r.horario_fim
    AND (NEW.data_agendamento::TIME) >= r.horario_inicio;

  IF (coalesce(ID_RESTRICAO_HORARIO_EXISTENTE, '') <> '') THEN
    raise exception 'TRIGGER_RAISE_EXCEPTION_3';
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_verificar_restricoes_horario_profissional
BEFORE INSERT ON "consulta"
FOR EACH ROW
EXECUTE PROCEDURE verificar_restricoes_horario_profissional();

-- DML
INSERT INTO "papel_usuario" ("nome") VALUES('OWNER');
INSERT INTO "papel_usuario" ("nome") VALUES('PROFESSIONAL');
INSERT INTO "papel_usuario" ("nome") VALUES('EMPLOYEE');
INSERT INTO "papel_usuario" ("nome") VALUES('PROFESSIONAL_UNCONFIGURED');

INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'READ_APPOINTMENTS');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'CREATE_PROFESSIONAL');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'READ_PROFESSIONAL');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'UPDATE_PROFESSIONAL');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'CREATE_EMPLOYEE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'READ_EMPLOYEE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'UPDATE_EMPLOYEE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'CREATE_PATIENT');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'READ_PATIENT');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'UPDATE_PATIENT');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'UPDATE_PROFESSIONAL');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'DELETE_PROFESSIONAL');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'DELETE_EMPLOYEE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(1, 'DELETE_PATIENT');

INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'UPDATE_PROFESSIONAL');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'CREATE_WEEKLY_SCHEDULE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'READ_WEEKLY_SCHEDULE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'UPDATE_WEEKLY_SCHEDULE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'CREATE_WEEKLY_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'DELETE_WEEKLY_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'READ_WEEKLY_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'UPDATE_WEEKLY_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'CREATE_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'READ_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'CREATE_COMMENTS');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'READ_COMMENTS');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'DELETE_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(2, 'READ_PATIENT');

INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'READ_APPOINTMENTS');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'UPDATE_APPOINTMENTS');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'READ_PROFESSIONAL');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'CREATE_PATIENT');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'READ_PATIENT');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'UPDATE_PATIENT');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'READ_WEEKLY_SCHEDULE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'READ_WEEKLY_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'READ_SCHEDULE_LOCK');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'DELETE_PATIENT');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'READ_LIABLE');
INSERT INTO "permissoes" ("id_papel_usuario", "nome") VALUES(3, 'CREATE_APPOINTMENT');