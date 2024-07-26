-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "isRemoved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "GovernmentRecord" ADD COLUMN     "deathDate" TIMESTAMP(3);
