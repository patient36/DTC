/*
  Warnings:

  - You are about to drop the column `owner` on the `Capsule` table. All the data in the column will be lost.
  - You are about to drop the column `payer` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Capsule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payerId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Capsule" DROP CONSTRAINT "Capsule_owner_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payer_fkey";

-- AlterTable
ALTER TABLE "Capsule" DROP COLUMN "owner",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payer",
ADD COLUMN     "payerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Capsule" ADD CONSTRAINT "Capsule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
