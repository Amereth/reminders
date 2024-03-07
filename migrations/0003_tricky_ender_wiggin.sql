ALTER TABLE "events" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "user_id" integer NOT NULL;