DROP DATABASE IF EXISTS k8s;
CREATE DATABASE IF NOT EXISTS k8s;

use k8s;

DROP TABLE IF EXISTS messages;
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  body VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL
);