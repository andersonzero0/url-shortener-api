/*
  Warnings:

  - You are about to drop the column `shortUrl` on the `UrlShortener` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortCode]` on the table `UrlShortener` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortCode` to the `UrlShortener` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UrlShortener_shortUrl_key";

-- AlterTable
ALTER TABLE "UrlShortener" DROP COLUMN "shortUrl",
ADD COLUMN     "shortCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortener_shortCode_key" ON "UrlShortener"("shortCode");
