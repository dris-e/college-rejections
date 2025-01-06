-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_College" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "acceptanceRate" REAL,
    "gradRate" REAL
);
INSERT INTO "new_College" ("acceptanceRate", "gradRate", "id", "name") SELECT "acceptanceRate", "gradRate", "id", "name" FROM "College";
DROP TABLE "College";
ALTER TABLE "new_College" RENAME TO "College";
CREATE UNIQUE INDEX "College_name_key" ON "College"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
