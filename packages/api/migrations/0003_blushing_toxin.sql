PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_flashcard` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`source_id`) REFERENCES `source`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_flashcard`("id", "source_id", "question", "answer", "created_at", "updated_at") SELECT "id", "source_id", "question", "answer", "created_at", "updated_at" FROM `flashcard`;--> statement-breakpoint
DROP TABLE `flashcard`;--> statement-breakpoint
ALTER TABLE `__new_flashcard` RENAME TO `flashcard`;--> statement-breakpoint
PRAGMA foreign_keys=ON;