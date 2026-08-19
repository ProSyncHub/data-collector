-- CreateEnum
CREATE TYPE "ScrapeStatus" AS ENUM ('TRIGGERED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "BestSellerSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "categoryUrl" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "status" "ScrapeStatus" NOT NULL DEFAULT 'TRIGGERED',
    "errorMessage" TEXT,
    "itemCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BestSellerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "asin" TEXT NOT NULL,
    "title" TEXT,
    "brand" TEXT,
    "manufacturer" TEXT,
    "description" TEXT,
    "currency" TEXT,
    "initialPrice" DOUBLE PRECISION,
    "finalPrice" DOUBLE PRECISION,
    "finalPriceHigh" DOUBLE PRECISION,
    "discount" TEXT,
    "availability" TEXT,
    "isAvailable" BOOLEAN,
    "rating" DOUBLE PRECISION,
    "reviewsCount" INTEGER,
    "boughtPastMonth" INTEGER,
    "sellerName" TEXT,
    "sellerId" TEXT,
    "numberOfSellers" INTEGER,
    "image" TEXT,
    "imageUrl" TEXT,
    "images" JSONB,
    "productDimensions" TEXT,
    "itemWeight" TEXT,
    "rootBsRank" INTEGER,
    "bsRank" INTEGER,
    "rootBsCategory" TEXT,
    "bsCategory" TEXT,
    "badge" TEXT,
    "amazonChoice" BOOLEAN,
    "sponsored" BOOLEAN,
    "amazonPrime" BOOLEAN,
    "url" TEXT,
    "domain" TEXT,
    "features" JSONB,
    "productDetails" JSONB,
    "categories" JSONB,
    "categoryTree" JSONB,
    "subcategoryRank" JSONB,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BestSellerItem" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "rank" INTEGER,
    "rootRank" INTEGER,
    "category" TEXT,
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BestSellerItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BestSellerSnapshot_snapshotId_key" ON "BestSellerSnapshot"("snapshotId");

-- CreateIndex
CREATE INDEX "BestSellerSnapshot_categoryUrl_idx" ON "BestSellerSnapshot"("categoryUrl");

-- CreateIndex
CREATE INDEX "BestSellerSnapshot_status_idx" ON "BestSellerSnapshot"("status");

-- CreateIndex
CREATE INDEX "BestSellerSnapshot_createdAt_idx" ON "BestSellerSnapshot"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_asin_key" ON "Product"("asin");

-- CreateIndex
CREATE INDEX "Product_bsRank_idx" ON "Product"("bsRank");

-- CreateIndex
CREATE INDEX "Product_rootBsRank_idx" ON "Product"("rootBsRank");

-- CreateIndex
CREATE INDEX "BestSellerItem_snapshotId_idx" ON "BestSellerItem"("snapshotId");

-- CreateIndex
CREATE INDEX "BestSellerItem_productId_idx" ON "BestSellerItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "BestSellerItem_snapshotId_productId_key" ON "BestSellerItem"("snapshotId", "productId");

-- AddForeignKey
ALTER TABLE "BestSellerItem" ADD CONSTRAINT "BestSellerItem_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "BestSellerSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestSellerItem" ADD CONSTRAINT "BestSellerItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
