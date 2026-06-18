-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SECRETARIAT');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'OUT_OF_STOCK', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Material" AS ENUM ('OR_18K', 'OR_24K', 'ARGENT_925', 'BRONZE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECUE', 'EN_FABRICATION', 'CONTROLE_QUALITE', 'LIVREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "NegotiationStatus" AS ENUM ('AUCUNE', 'AUTO_VALIDEE', 'EN_ATTENTE', 'VALIDEE', 'REJETEE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "bannerUrl" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "prixMax" DECIMAL(12,2) NOT NULL,
    "prixMin" DECIMAL(12,2) NOT NULL,
    "material" "Material" NOT NULL,
    "weightApproxG" DECIMAL(8,2),
    "stone" TEXT,
    "setting" TEXT,
    "hallmark" TEXT,
    "sizeOptions" TEXT[],
    "colorOptions" TEXT[],
    "engravingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "deliveryDelay" TEXT,
    "warranty" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "badges" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "deliveryAddress" TEXT NOT NULL,
    "deliveryCity" TEXT NOT NULL,
    "deliveryNotes" TEXT,
    "remarks" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'RECUE',
    "totalCatalogue" DECIMAL(12,2) NOT NULL,
    "totalReal" DECIMAL(12,2),
    "deliveryFee" DECIMAL(12,2),
    "handledById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productNameSnap" TEXT NOT NULL,
    "variantSize" TEXT,
    "variantColor" TEXT,
    "engravingText" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "prixCatalogueSnap" DECIMAL(12,2) NOT NULL,
    "prixMinSnap" DECIMAL(12,2) NOT NULL,
    "prixReelUnitaire" DECIMAL(12,2),

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Negotiation" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderItemId" TEXT,
    "prixCatalogue" DECIMAL(12,2) NOT NULL,
    "prixMin" DECIMAL(12,2) NOT NULL,
    "prixPropose" DECIMAL(12,2) NOT NULL,
    "ecart" DECIMAL(12,2) NOT NULL,
    "proofImageUrl" TEXT,
    "reason" TEXT,
    "status" "NegotiationStatus" NOT NULL DEFAULT 'AUCUNE',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "decidedById" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Negotiation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_reference_idx" ON "Order"("reference");

-- CreateIndex
CREATE INDEX "Negotiation_orderId_idx" ON "Negotiation"("orderId");

-- CreateIndex
CREATE INDEX "Negotiation_status_idx" ON "Negotiation"("status");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
