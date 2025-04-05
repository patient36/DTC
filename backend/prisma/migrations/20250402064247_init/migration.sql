/*
  Warnings:

  - You are about to drop the column `allowedStorage` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Capsule" ADD COLUMN     "attachmentsSize" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "allowedStorage";
