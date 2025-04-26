/*
  Warnings:

  - You are about to drop the column `validity` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "validity";

-- DropEnum
DROP TYPE "Validity";
