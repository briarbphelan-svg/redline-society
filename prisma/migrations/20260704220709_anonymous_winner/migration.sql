-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "addressLine1" TEXT NOT NULL DEFAULT '',
    "addressLine2" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'US',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "packageId" TEXT,
    "packageName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "entries" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "anonymousWinner" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT NOT NULL DEFAULT '',
    "stripePaymentIntentId" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("addressLine1", "addressLine2", "city", "country", "createdAt", "email", "entries", "id", "name", "number", "packageId", "packageName", "postalCode", "quantity", "state", "status", "stripePaymentIntentId", "stripeSessionId", "totalCents", "updatedAt") SELECT "addressLine1", "addressLine2", "city", "country", "createdAt", "email", "entries", "id", "name", "number", "packageId", "packageName", "postalCode", "quantity", "state", "status", "stripePaymentIntentId", "stripeSessionId", "totalCents", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");
CREATE INDEX "Order_email_idx" ON "Order"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
