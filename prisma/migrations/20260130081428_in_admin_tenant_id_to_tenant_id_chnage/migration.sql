/*
  Warnings:

  - You are about to drop the column `tenantId` on the `admins` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_tenantId_fkey";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "tenantId",
ADD COLUMN     "tenant_id" TEXT;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
