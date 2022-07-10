-- AlterTable
CREATE SEQUENCE "user_access_code_seq";
ALTER TABLE "user" ALTER COLUMN "access_code" SET DEFAULT nextval('user_access_code_seq');
ALTER SEQUENCE "user_access_code_seq" OWNED BY "user"."access_code";
