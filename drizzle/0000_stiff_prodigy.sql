CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor" text DEFAULT 'system' NOT NULL,
	"action" text NOT NULL,
	"entity" text,
	"entity_name" text,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text DEFAULT 'general' NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"city" text,
	"state" text,
	"message" text,
	"machine_id" integer,
	"machine_name" text,
	"model" text,
	"color" text,
	"capacity" text,
	"price" real,
	"item_id" integer,
	"item_name" text,
	"status" text DEFAULT 'new' NOT NULL,
	"assigned_to" integer,
	"assigned_name" text,
	"source" text DEFAULT 'website',
	"notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"path" text,
	"entity_id" integer,
	"entity_name" text,
	"lang" text DEFAULT 'en',
	"device" text,
	"source" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"t" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "festivals" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"t" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"festival_date" timestamp NOT NULL,
	"days_before" integer DEFAULT 5 NOT NULL,
	"banner_url" text,
	"bg_image" text,
	"color_a" text DEFAULT '#ff5a10' NOT NULL,
	"color_b" text DEFAULT '#7922fc' NOT NULL,
	"offer_text" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"discount" real DEFAULT 0 NOT NULL,
	"coupon_code" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "festivals_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"t" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"description" text,
	"category" text DEFAULT 'factory' NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "machines" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'Paper Plate Machine' NOT NULL,
	"t" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"mrp" real DEFAULT 0 NOT NULL,
	"company_price" real DEFAULT 0 NOT NULL,
	"offer_price" real DEFAULT 0 NOT NULL,
	"discount" real DEFAULT 0 NOT NULL,
	"cover_image" text,
	"media" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"models" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"specs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"capacity" text,
	"production_per_hour" integer DEFAULT 0 NOT NULL,
	"power" text,
	"warranty" text,
	"active" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "machines_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "newsletter" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"t" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"machine_id" integer,
	"machine_name" text,
	"cover_image" text,
	"bg_image" text,
	"mrp" real DEFAULT 0 NOT NULL,
	"company_price" real DEFAULT 0 NOT NULL,
	"offer_price" real DEFAULT 0 NOT NULL,
	"discount" real DEFAULT 0 NOT NULL,
	"included_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"festival_id" integer,
	"festival_name" text,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp DEFAULT now() NOT NULL,
	"coupon_code" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "offers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "raw_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"t" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"image" text,
	"price" real DEFAULT 0 NOT NULL,
	"mrp" real DEFAULT 0 NOT NULL,
	"unit" text DEFAULT 'kg' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"low_stock_at" integer DEFAULT 10 NOT NULL,
	"grade" text,
	"gsm" text,
	"specs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "raw_materials_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spare_parts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"part_code" text NOT NULL,
	"t" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"machine_id" integer,
	"machine_name" text,
	"image" text,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"mrp" real DEFAULT 0 NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"availability" text DEFAULT 'in_stock' NOT NULL,
	"material" text,
	"warranty" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "spare_parts_part_code_unique" UNIQUE("part_code")
);
--> statement-breakpoint
CREATE TABLE "ticket_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"status" text,
	"message" text NOT NULL,
	"by_admin" boolean DEFAULT false NOT NULL,
	"author_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_number" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"city" text,
	"machine_id" integer,
	"machine_name" text,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"assigned_to" integer,
	"assigned_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'content_manager' NOT NULL,
	"phone" text,
	"avatar" text,
	"active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "enq_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "enq_created_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ev_type_idx" ON "events" USING btree ("type");--> statement-breakpoint
CREATE INDEX "ev_created_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "machines_active_idx" ON "machines" USING btree ("active");--> statement-breakpoint
CREATE INDEX "machines_sort_idx" ON "machines" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "upd_ticket_idx" ON "ticket_updates" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "ticket_status_idx" ON "tickets" USING btree ("status");