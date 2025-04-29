/*
  Warnings:

  - Made the column `paidUntil` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "paidUntil" SET NOT NULL,
ALTER COLUMN "paidUntil" SET DEFAULT CURRENT_TIMESTAMP;
