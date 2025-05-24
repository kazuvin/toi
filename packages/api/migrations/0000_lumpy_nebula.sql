CREATE TABLE `users` (
	`uid` text PRIMARY KEY NOT NULL,
	`email` text,
	`display_name` text,
	`photo_url` text,
	`created_at` text DEFAULT CURRENT_DATE,
	`updated_at` text DEFAULT CURRENT_DATE,
	`user_type` text NOT NULL,
	`subscription_plan` text,
	`subscription_expires_at` text,
	`is_admin` integer NOT NULL
);
