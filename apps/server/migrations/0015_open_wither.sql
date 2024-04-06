ALTER TABLE "event_label" RENAME COLUMN "user_id" TO "label_id";--> statement-breakpoint
ALTER TABLE "event_label" DROP CONSTRAINT "event_label_user_id_labels_id_fk";
--> statement-breakpoint
ALTER TABLE "event_label" DROP CONSTRAINT "event_label_event_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "event_label" ADD CONSTRAINT "event_label_event_id_label_id_pk" PRIMARY KEY("event_id","label_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_label" ADD CONSTRAINT "event_label_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
