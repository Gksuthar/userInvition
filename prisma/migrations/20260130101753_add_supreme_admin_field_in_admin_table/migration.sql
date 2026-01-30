/*
  Warnings:

  - You are about to drop the column `is_verified` on the `admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "is_verified",
ADD COLUMN     "is_supreme_admin" BOOLEAN NOT NULL DEFAULT false;
