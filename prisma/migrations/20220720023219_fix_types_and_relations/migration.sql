/*
  Warnings:

  - The primary key for the `liable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[cpf]` on the table `person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "liable_person_id_key";

-- AlterTable
ALTER TABLE "address" ADD COLUMN     "state" VARCHAR(100) NOT NULL,
ADD COLUMN     "zip_code" VARCHAR(12) NOT NULL,
ALTER COLUMN "district" DROP NOT NULL;

-- AlterTable
ALTER TABLE "liable" DROP CONSTRAINT "liable_pkey",
ADD CONSTRAINT "liable_pkey" PRIMARY KEY ("patient_id");

-- AlterTable
ALTER TABLE "person" ALTER COLUMN "cpf" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "person_cpf_key" ON "person"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_name_key" ON "user"("user_name");
