CREATE TABLE IF NOT EXISTS "event_label" (
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "event_label_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "labels" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_label" ADD CONSTRAINT "event_label_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_label" ADD CONSTRAINT "event_label_user_id_labels_id_fk" FOREIGN KEY ("user_id") REFERENCES "labels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
