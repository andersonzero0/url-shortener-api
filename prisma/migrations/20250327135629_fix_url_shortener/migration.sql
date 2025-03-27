/*
  Warnings:

  - You are about to drop the column `accessCount` on the `UrlShortener` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UrlShortener" DROP COLUMN "accessCount",
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0;
