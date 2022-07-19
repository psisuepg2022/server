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