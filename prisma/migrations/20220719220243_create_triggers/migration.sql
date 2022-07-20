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
    AND new.data_agendamento > c.data_agendamento
    AND new.data_agendamento < (c.data_agendamento + (DURACAO_CONSULTA* interval '1 minute'))
  LIMIT 1;

  IF (coalesce(ID_CONSULTA_EXISTENTE, '') <> '') THEN
    raise exception 'Já existe uma consulta marcada não-concluída para este profissional no horário informado.';
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_previnir_consultas_mesmo_horario
BEFORE INSERT ON "consulta"
FOR EACH ROW
EXECUTE PROCEDURE previnir_consultas_mesmo_horario();