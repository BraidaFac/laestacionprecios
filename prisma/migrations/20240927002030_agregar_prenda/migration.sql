/*
  Warnings:

  - Added the required column `prenda` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `prenda` VARCHAR(191) NOT NULL;
