ALTER TABLE "marathon" ADD COLUMN "invitation_code" text;--> statement-breakpoint
ALTER TABLE "marathon" ADD CONSTRAINT "marathon_invitation_code_unique" UNIQUE("invitation_code");