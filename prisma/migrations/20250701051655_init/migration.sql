/*
  Warnings:

  - The primary key for the `Spending` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Spending" DROP CONSTRAINT "Spending_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Spending_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Spending_id_seq";
