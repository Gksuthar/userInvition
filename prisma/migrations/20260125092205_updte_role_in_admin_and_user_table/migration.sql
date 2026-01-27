/*
  Warnings:

  - You are about to drop the column `invite_by` on the `admins` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_invite_by_fkey";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "invite_by";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "invite_by" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_invite_by_fkey" FOREIGN KEY ("invite_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
