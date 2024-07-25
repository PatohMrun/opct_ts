/*
  Warnings:

  - You are about to drop the column `adminId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_adminId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "adminId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Admin";
