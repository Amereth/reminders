-- Custom SQL migration file, put you code below! --
ALTER TABLE "events"
ALTER COLUMN "created_at"
SET DEFAULT now();