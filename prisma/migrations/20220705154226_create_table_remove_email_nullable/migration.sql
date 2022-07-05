/*
  Warnings:

  - Made the column `email` on table `clinic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clinic" ALTER COLUMN "email" SET NOT NULL;
