-- This is an empty migration.

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
    AND c.id_paciente <> NEW.id_paciente
    AND NEW.data_agendamento >= c.data_agendamento
    AND NEW.data_agendamento <= (c.data_agendamento + (DURACAO_CONSULTA* interval '1 minute'))
  LIMIT 1;

  IF (coalesce(ID_CONSULTA_EXISTENTE, '') <> '') THEN
    raise exception 'Já existe uma consulta marcada não-concluída para este profissional no horário informado.';
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_previnir_consultas_mesmo_horario
BEFORE INSERT OR UPDATE ON "consulta"
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
    AND (NEW.data_agendamento::TIME) > ag.horario_inicio;

  IF (coalesce(ID_AGENDA_SEMANAL_EXISTENTE, '') = '') THEN
    raise exception 'Não existe um horário na agenda semanal do profissional que compreende a data de agendamento.';
  END IF;

  SELECT rag.id INTO ID_RESTRICAO_AGENDA_SEMANAL_EXISTENTE
  FROM restricoes_agenda_semanal rag
  WHERE
    rag.id_agenda_semanal = (ID_AGENDA_SEMANAL_EXISTENTE::UUID)
    AND (NEW.data_agendamento::TIME) < rag.horario_fim
    AND (NEW.data_agendamento::TIME) > rag.horario_inicio; 

  IF (coalesce(ID_RESTRICAO_AGENDA_SEMANAL_EXISTENTE, '') <> '') THEN
    raise exception 'Existe uma restrição de horário na agenda semanal do profissional para a data de agendamento.';
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
    AND (NEW.data_agendamento::TIME) > r.horario_inicio;

  IF (coalesce(ID_RESTRICAO_HORARIO_EXISTENTE, '') <> '') THEN
    raise exception 'Existe uma restrição de horário do profissional conflitando com a data de agendamento.';
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_verificar_restricoes_horario_profissional
BEFORE INSERT ON "consulta"
FOR EACH ROW
EXECUTE PROCEDURE verificar_restricoes_horario_profissional();