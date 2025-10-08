/*
  Warnings:

  - You are about to drop the column `externalId` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Category_externalId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "externalId";
