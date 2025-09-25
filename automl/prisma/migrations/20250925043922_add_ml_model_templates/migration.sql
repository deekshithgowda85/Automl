-- CreateTable
CREATE TABLE "public"."ml_model_templates" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "downloads" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "lastUpdated" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "iconName" TEXT NOT NULL,
    "isPopular" BOOLEAN NOT NULL,
    "gradient" TEXT NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL,
    "trainingTime" TEXT NOT NULL,
    "users" TEXT NOT NULL,
    "useCases" JSONB NOT NULL,
    "features" JSONB NOT NULL,
    "advantages" JSONB NOT NULL,
    "howItWorks" JSONB NOT NULL,
    "bestFor" JSONB NOT NULL,
    "parameters" JSONB NOT NULL,
    "codeExample" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ml_model_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ml_model_templates_slug_key" ON "public"."ml_model_templates"("slug");
