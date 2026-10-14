/*
  Warnings:

  - You are about to drop the column `schoolId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `school` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_schoolId_fkey`;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `schoolId`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `schoolId`;

-- DropTable
DROP TABLE `school`;
