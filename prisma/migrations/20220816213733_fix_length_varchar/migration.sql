/*
  Warnings:

  - You are about to alter the column `zip_code` on the `address` table. The data in that column could be lost. The data in that column will be cast from `VarChar(12)` to `VarChar(8)`.
  - You are about to alter the column `cpf` on the `person` table. The data in that column could be lost. The data in that column will be cast from `VarChar(16)` to `VarChar(11)`.
  - You are about to alter the column `contact_number` on the `person` table. The data in that column could be lost. The data in that column will be cast from `VarChar(32)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "address" ALTER COLUMN "zip_code" SET DATA TYPE VARCHAR(8);

-- AlterTable
ALTER TABLE "person" ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(11),
ALTER COLUMN "contact_number" SET DATA TYPE VARCHAR(11);
