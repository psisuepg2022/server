/*
  Warnings:

  - You are about to drop the column `domainClass` on the `person` table. All the data in the column will be lost.
  - Added the required column `domain_class` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "person" DROP COLUMN "domainClass",
ADD COLUMN     "domain_class" VARCHAR(32) NOT NULL;
