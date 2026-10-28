CREATE TYPE "public"."cat_status" AS ENUM('disponivel', 'adotado');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'volunteer');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('F', 'M');--> statement-breakpoint
CREATE TYPE "public"."test_result" AS ENUM('negativo', 'positivo', 'nao_testado');--> statement-breakpoint
CREATE TABLE "cat_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cat_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cat_photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sex" "sex" NOT NULL,
	"birth_date" date NOT NULL,
	"arrival_date" date NOT NULL,
	"coat_color" text DEFAULT '' NOT NULL,
	"neutered" boolean DEFAULT false NOT NULL,
	"vaccinated" boolean DEFAULT false NOT NULL,
	"dewormed" boolean DEFAULT false NOT NULL,
	"fiv" "test_result" DEFAULT 'nao_testado' NOT NULL,
	"felv" "test_result" DEFAULT 'nao_testado' NOT NULL,
	"story" text DEFAULT '' NOT NULL,
	"traits" text[] DEFAULT '{}'::text[] NOT NULL,
	"status" "cat_status" DEFAULT 'disponivel' NOT NULL,
	"adopted_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cats_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "cats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'volunteer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cat_photos" ADD CONSTRAINT "cat_photos_cat_id_cats_id_fk" FOREIGN KEY ("cat_id") REFERENCES "public"."cats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cat_photos_cat_idx" ON "cat_photos" USING btree ("cat_id","position");--> statement-breakpoint
CREATE INDEX "cats_status_idx" ON "cats" USING btree ("status");