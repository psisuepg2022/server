/*
  Warnings:

  - Made the column `telefone` on table `pessoa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pessoa" ALTER COLUMN "telefone" SET NOT NULL;
