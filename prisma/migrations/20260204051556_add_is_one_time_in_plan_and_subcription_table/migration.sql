-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "is_one_time" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "is_one_time" BOOLEAN NOT NULL DEFAULT false;
