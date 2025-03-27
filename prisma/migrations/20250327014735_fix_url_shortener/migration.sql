/*
  Warnings:

  - A unique constraint covering the columns `[shortUrl]` on the table `UrlShortener` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UrlShortener" DROP CONSTRAINT "UrlShortener_userId_fkey";

-- AlterTable
ALTER TABLE "UrlShortener" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortener_shortUrl_key" ON "UrlShortener"("shortUrl");

-- AddForeignKey
ALTER TABLE "UrlShortener" ADD CONSTRAINT "UrlShortener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
