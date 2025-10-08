/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_externalId_key" ON "Category"("externalId");
