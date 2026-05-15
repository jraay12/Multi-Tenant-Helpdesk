/*
  Warnings:

  - Added the required column `customer_name` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `customer_name` VARCHAR(191) NOT NULL;
