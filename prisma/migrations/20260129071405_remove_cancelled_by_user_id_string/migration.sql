/*
  Warnings:

  - You are about to drop the column `cancelled_by_user_id` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "cancelled_by_user_id";
