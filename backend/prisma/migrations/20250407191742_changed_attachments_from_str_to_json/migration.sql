/*
  Warnings:

  - Changed the type of `attachments` on the `Capsule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Capsule" DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB NOT NULL;
