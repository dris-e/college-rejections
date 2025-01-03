-- CreateTable
CREATE TABLE "Rejection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collegeId" TEXT NOT NULL,
    "dateRejected" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateApplied" DATETIME NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "highSchool" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "gpa" REAL NOT NULL,
    "sat" INTEGER,
    "act" INTEGER,
    "classRank" INTEGER,
    "extracurriculars" TEXT,
    "major" TEXT,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rejection_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "acceptanceRate" REAL DEFAULT 100,
    "gradRate" REAL DEFAULT 100
);

-- CreateIndex
CREATE UNIQUE INDEX "College_name_key" ON "College"("name");
