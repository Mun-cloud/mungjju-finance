-- CreateTable
CREATE TABLE "Spending" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "date" DATETIME,
    "where" TEXT,
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
