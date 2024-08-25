-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for trampa
CREATE DATABASE IF NOT EXISTS `trampa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `trampa`;

-- Dumping structure for table trampa.blog_posts
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `images` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table trampa.blog_posts: ~2 rows (approximately)
INSERT IGNORE INTO `blog_posts` (`id`, `title`, `body`, `images`, `created_at`) VALUES
	('87EB5C110F4DC135932E', 'My First Blog Post', 'This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client\'s vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.', '["1724577252241.PNG","1724577252252.PNG","1724577252253.PNG","1724577252259.PNG"]', '2024-08-25 09:14:12'),
	('AB84D02F728B0DF197EE', 'My First Blog Post', 'This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client\'s vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.', '["1724577047402.PNG","1724577047414.PNG","1724577047416.PNG","1724577047430.PNG"]', '2024-08-25 09:10:47'),
	('B20DE105550386F0FFF0', 'My First Blog Post', 'This Software Requirements Specification (SRS) document outlines the essential requirements for the development of a mobile application designed to connect users with therapists for love-related issues. By detailing the functional and non-functional requirements, user interfaces, external interfaces, and system architecture, this document serves as a comprehensive guide for all stakeholders involved in the project.\n\nThe application aims to provide a seamless and secure platform where users can seek advice from professional therapists and receive timely responses. With a focus on user experience, data security, and performance, the system is designed to meet the needs of both users and therapists effectively. The outlined requirements and architectural details ensure that the development process is well-structured, reducing the risk of miscommunication and ensuring that the final product aligns with the client\'s vision.\n\nMoving forward, adherence to this SRS will facilitate the successful implementation of the application, ultimately delivering a product that meets the expectations of the end-users and supports the ongoing growth and success of the service.', '["1724577209980.PNG","1724577209990.PNG","1724577209996.PNG","1724577210003.PNG"]', '2024-08-25 09:13:30');

-- Dumping structure for table trampa.course_registration
CREATE TABLE IF NOT EXISTS `course_registration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL DEFAULT '0',
  `Salutation` varchar(50) NOT NULL,
  `fullName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `position` varchar(50) NOT NULL,
  `company` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `fax` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table trampa.course_registration: ~0 rows (approximately)

-- Dumping structure for table trampa.credentials
CREATE TABLE IF NOT EXISTS `credentials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `password_hash` varchar(120) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '0',
  `loginAttempts` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_credentials_users` (`user_id`),
  CONSTRAINT `FK_credentials_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table trampa.credentials: ~4 rows (approximately)
INSERT IGNORE INTO `credentials` (`id`, `user_id`, `password_hash`, `role`, `status`, `loginAttempts`) VALUES
	(11, '1a5d0bc8f18acd369775f8ca0c67fb9e', '$2b$10$NwItzQzjaVAVTH3cE74D7.FrmlPIh50P4jTK5s.FS9JmHNJ6BmN7S', 'admin', 0, 0),
	(12, '4858c1886f5e0b4c6504305f91e586b6', '$2b$10$s0EQl9XjHKTAkbHaIC0WY.kEd06DAOp3XWgQDXsMpIcwbtlmPXm2S', 'user', 0, 2),
	(13, '90e5fe6faf853fad3301bd61c6cc60a3', '$2b$10$b0NLseYBpcwp50ZC.741UO/kxpuX5gq4i1aiWI431qbT81E2wmmwy', 'admin', 0, 0),
	(14, '6b100077ac8cc8cc4ec92232182e85ac', '$2b$10$zmzV0JO9CBrdcfSgYNxziesVxvwC3EkyJV9ZxQyR1vl/hTZrxF29W', 'admin', 0, 0);

-- Dumping structure for table trampa.event_registration
CREATE TABLE IF NOT EXISTS `event_registration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `position` varchar(50) NOT NULL,
  `company` varchar(50) NOT NULL,
  `telephone` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `membership_number` varchar(50) NOT NULL,
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table trampa.event_registration: ~0 rows (approximately)

-- Dumping structure for table trampa.membership
CREATE TABLE IF NOT EXISTS `membership` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(70) NOT NULL,
  `membership_id` varchar(70) NOT NULL,
  PRIMARY KEY (`membership_id`),
  KEY `id` (`id`),
  KEY `FK_membership_users` (`user_id`),
  CONSTRAINT `FK_membership_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table trampa.membership: ~0 rows (approximately)

-- Dumping structure for table trampa.register_events
CREATE TABLE IF NOT EXISTS `register_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `title` varchar(300) NOT NULL,
  `theme` varchar(200) NOT NULL,
  `venue` varchar(200) NOT NULL,
  `date` varchar(200) NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table trampa.register_events: ~0 rows (approximately)
INSERT IGNORE INTO `register_events` (`id`, `event_id`, `title`, `theme`, `venue`, `date`) VALUES
	(1, 1, 'Tech Conference', 'Innovation', 'Convention Center', '2024-09-15'),
	(2, 2, 'Tech Conference', 'Innovation', 'Convention Center', '2024-09-15');

-- Dumping structure for table trampa.users
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This stores basic user information';

-- Dumping data for table trampa.users: ~4 rows (approximately)
INSERT IGNORE INTO `users` (`id`, `user_id`, `first_name`, `lastname`, `gender`, `phone_number`, `email`) VALUES
	(11, '1a5d0bc8f18acd369775f8ca0c67fb9e', 'John', 'Juma', 'Male', '0755382514', 'isaya.jama@axample.com'),
	(12, '4858c1886f5e0b4c6504305f91e586b6', 'John', 'Doe', 'Male', '0768579533', 'johndoe@axample.com'),
	(14, '6b100077ac8cc8cc4ec92232182e85ac', 'Ibrahim', 'Chuwa', 'Male', '0687372309', 'ibrsa@example.com'),
	(13, '90e5fe6faf853fad3301bd61c6cc60a3', 'Ibrahim', 'Chuwa', 'Male', '0687374309', 'ibra@example.com');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
