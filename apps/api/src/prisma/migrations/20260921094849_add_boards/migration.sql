-- CreateEnum
CREATE TYPE "BoardVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ViewType" AS ENUM ('KANBAN', 'CANVAS', 'TIMELINE', 'MAP', 'BLOG');

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "BoardVisibility" NOT NULL DEFAULT 'PRIVATE',
    "viewType" "ViewType" NOT NULL DEFAULT 'KANBAN',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Board_ownerId_idx" ON "Board"("ownerId");

-- CreateIndex
CREATE INDEX "Board_createdAt_idx" ON "Board"("createdAt");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
