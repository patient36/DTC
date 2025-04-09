/*
  Warnings:

  - You are about to drop the column `used` on the `Payment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Validity" AS ENUM ('ACTIVE', 'EXPIRED');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "used",
ADD COLUMN     "validity" "Validity" NOT NULL DEFAULT 'ACTIVE';
