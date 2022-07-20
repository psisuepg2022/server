/*
  Warnings:

  - You are about to drop the column `active` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "person" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "active";
