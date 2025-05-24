CREATE TABLE `explain_history` (
	`id` text PRIMARY KEY NOT NULL,
	`uid` text NOT NULL,
	`expression` text NOT NULL,
	`explanation` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`uid`) REFERENCES `users`(`uid`) ON UPDATE no action ON DELETE no action
);
