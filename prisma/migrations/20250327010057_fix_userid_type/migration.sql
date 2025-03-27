-- CreateTable
CREATE TABLE "UrlShortener" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "UrlShortener_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UrlShortener" ADD CONSTRAINT "UrlShortener_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
