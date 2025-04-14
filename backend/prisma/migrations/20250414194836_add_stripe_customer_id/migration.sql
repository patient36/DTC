-- AlterEnum
ALTER TYPE "Validity" ADD VALUE 'DECLINED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;
