/*
  Warnings:

  - A unique constraint covering the columns `[codigo,prenda,descripcion]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Article_codigo_key` ON `Article`;

-- CreateIndex
CREATE UNIQUE INDEX `Article_codigo_prenda_descripcion_key` ON `Article`(`codigo`, `prenda`, `descripcion`);
