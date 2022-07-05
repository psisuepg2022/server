-- AlterTable
ALTER TABLE "clinic" ALTER COLUMN "code" SET DEFAULT nextval('generate_clinic_code');
