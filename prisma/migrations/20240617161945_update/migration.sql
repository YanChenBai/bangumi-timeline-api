/*
  Warnings:

  - Added the required column `hash` to the `Data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Data` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Data" ("id", "key", "value") SELECT "id", "key", "value" FROM "Data";
DROP TABLE "Data";
ALTER TABLE "new_Data" RENAME TO "Data";
CREATE UNIQUE INDEX "Data_key_key" ON "Data"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
