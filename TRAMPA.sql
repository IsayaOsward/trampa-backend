CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  images TEXT NOT NULL,   -- Store image filenames as JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
