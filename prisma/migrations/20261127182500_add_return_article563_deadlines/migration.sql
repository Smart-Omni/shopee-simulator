ALTER TABLE "returns"
  ADD COLUMN IF NOT EXISTS "buyer_return_due_date" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "expected_return_date" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "reverse_delivered_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "is_nfr_exempt" BOOLEAN NOT NULL DEFAULT false;
