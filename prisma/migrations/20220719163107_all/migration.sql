-- CreateSequence
CREATE SEQUENCE gerar_codigo_base_clinica INCREMENT 1000 START 1000;

-- CreateTable
CREATE TABLE "clinica" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "codigo_base" INTEGER NOT NULL DEFAULT NEXTVAL('gerar_codigo_base_clinica'),

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
CREATE UNIQUE INDEX "usuario_id_key" ON "usuario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nome_usuario_key" ON "usuario"("nome_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "papel_usuario_nome_key" ON "papel_usuario"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_nome_key" ON "permissoes"("nome");

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