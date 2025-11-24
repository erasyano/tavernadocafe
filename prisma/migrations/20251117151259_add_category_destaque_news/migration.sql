-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_News" ("authorId", "content", "createdAt", "id", "image", "published", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "image", "published", "title", "updatedAt" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
