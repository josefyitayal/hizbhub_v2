ALTER TABLE "creator_codes" RENAME COLUMN "default_commission" TO "commission_rate";--> statement-breakpoint
ALTER TABLE "creator_codes" RENAME COLUMN "discount_value" TO "discount_rate";--> statement-breakpoint
ALTER TABLE "creator_codes" RENAME COLUMN "affiliate_slug" TO "referral_code";--> statement-breakpoint
ALTER TABLE "discount_codes" RENAME COLUMN "value" TO "discount_value";--> statement-breakpoint
ALTER TABLE "creator_codes" DROP CONSTRAINT "creator_codes_affiliate_slug_unique";--> statement-breakpoint
ALTER TABLE "creator_codes" ADD CONSTRAINT "creator_codes_referral_code_unique" UNIQUE("referral_code");