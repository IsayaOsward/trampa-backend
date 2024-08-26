CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone_number` varchar(13) NOT NULL,
  `email` varchar(70) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `id` (`id`)
) 


CREATE TABLE `credentials` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(50) NOT NULL COLLATE,
	`password_hash` VARCHAR(120) NOT NULL,
	`role` VARCHAR(50) NOT NULL DEFAULT '0',
	`status` INT(10) NOT NULL DEFAULT '0',
	`loginAttempts` INT(10) NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_credentials_users` (`user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE NO ACTION ON DELETE CASCADE
)

CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  images TEXT NOT NULL,   -- Store image filenames as JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `register_events` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`event_id` INT(10) NOT NULL,
	`title` VARCHAR(300) NOT NULL,
	`theme` VARCHAR(200) NOT NULL,
	`venue` VARCHAR(200) NOT NULL,
	`date` VARCHAR(200) NOT NULL,
	PRIMARY KEY (`event_id`),
	INDEX `id` (`id`))

CREATE TABLE `event_registration` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`event_id` VARCHAR(50) NOT NULL,
	`first_name` VARCHAR(50) NOT NULL,
	`lastname` VARCHAR(50) NOT NULL,
	`email` VARCHAR(50) NOT NULL,
	`mobile` VARCHAR(50) NOT NULL,
	`position` VARCHAR(50) NOT NULL,
	`company` VARCHAR(50) NOT NULL,
	`telephone` VARCHAR(50) NOT NULL,
	`country` VARCHAR(50) NOT NULL,
	`membership_number` VARCHAR(50) NOT NULL,
	INDEX `id` (`id`)
	CONSTRAINT `FK_events_regitser_events` FOREIGN KEY (`event_id`) REFERENCES `register_events` (`event_id`) ON UPDATE CASCADE ON DELETE CASCADE
)


CREATE TABLE `membership` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(70) NOT NULL,
	`membership_id` VARCHAR(70),
	PRIMARY KEY (`membership_id`),
	INDEX `id` (`id`),
	INDEX `FK_membership_users` (`user_id`),
	CONSTRAINT `FK_membership_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE ON DELETE CASCADE
);
