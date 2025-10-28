/*
  Warnings:

  - You are about to drop the column `total` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[guestId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "total";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_guestId_key" ON "User"("guestId");
