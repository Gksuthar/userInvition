-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "deleted_at" DROP NOT NULL;
