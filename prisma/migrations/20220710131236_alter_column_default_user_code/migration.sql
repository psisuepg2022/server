-- This is an empty migration.

CREATE FUNCTION create_user_code () RETURNS TRIGGER
AS $$
DECLARE CLINIC_CODE BIGINT;
BEGIN
  SELECT c.code INTO CLINIC_CODE
  FROM clinic c
  WHERE c.id = (SELECT p.clinic_id FROM person p WHERE p.id = NEW.id);

  NEW.access_code := NEW.access_code + CLINIC_CODE;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_create_user_code
BEFORE INSERT ON "user"
FOR EACH ROW
EXECUTE PROCEDURE create_user_code();