/*
  Warnings:

  - You are about to drop the column `role` on the `admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "role",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
