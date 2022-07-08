/*
  Warnings:

  - You are about to drop the column `class` on the `person` table. All the data in the column will be lost.
  - Added the required column `domainClass` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "person" DROP COLUMN "class",
ADD COLUMN     "domainClass" VARCHAR(32) NOT NULL;
