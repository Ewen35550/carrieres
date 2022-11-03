CREATE TABLE users(
   id INT AUTO_INCREMENT,
   lastname VARCHAR(50) NOT NULL,
   firstname VARCHAR(50) NOT NULL,
   mail VARCHAR(250) NOT NULL,
   password VARCHAR(250) NOT NULL,
   isAdmin BOOLEAN NOT NULL DEFAULT 0,
   PRIMARY KEY(id)
);