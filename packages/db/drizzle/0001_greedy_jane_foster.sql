ALTER TABLE "site_settings" ADD COLUMN "phone" varchar(30);--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "wechat" varchar(100);--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "opening_hours" varchar(255);--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "price_range" varchar(100);--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "seo_keywords" varchar(500);--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "service_area_desc" varchar(500);--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "robots_extra" text;