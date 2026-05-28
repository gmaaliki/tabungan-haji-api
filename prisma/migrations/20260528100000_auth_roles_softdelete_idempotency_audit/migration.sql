-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" VARCHAR(20) NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "nasabah" ADD COLUMN "user_id" TEXT,
ADD COLUMN "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transaksi" ADD COLUMN "idempotency_key" VARCHAR(80);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "entity_id" TEXT NOT NULL,
    "actor_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nasabah_user_id_key" ON "nasabah"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaksi_idempotency_key_key" ON "transaksi"("idempotency_key");

-- AddForeignKey
ALTER TABLE "nasabah" ADD CONSTRAINT "nasabah_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
