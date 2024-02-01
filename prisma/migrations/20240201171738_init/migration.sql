-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('InReview', 'InProgress', 'Blocked', 'Overdue', 'Completed');

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "status" "TodoStatus" NOT NULL DEFAULT 'InReview',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
