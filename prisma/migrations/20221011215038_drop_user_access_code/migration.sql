/*
  Warnings:

  - You are about to drop the column `codigo_acesso` on the `usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "usuario_nome_usuario_key";

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "codigo_acesso";