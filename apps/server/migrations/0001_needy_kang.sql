ALTER TABLE "events" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" SET DEFAULT now();