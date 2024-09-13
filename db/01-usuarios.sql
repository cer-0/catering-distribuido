-- Creación de Tablespace (equivalente en MariaDB sería usar una base de datos)
CREATE DATABASE catering;
USE catering;

-------------------------
-- Creación de usuario --
-------------------------
SELECT user FROM mysql.user;
CREATE USER 'dataProyect'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON catering.* TO 'dataProyect'@'localhost';
FLUSH PRIVILEGES;

---------------------
-- Creación de rol --
---------------------
-- MariaDB no soporta roles de forma nativa, por lo que esta parte se debe simular mediante la creación de un usuario con permisos específicos. Sin embargo, desde MariaDB 10.0.5 en adelante sí es posible usar roles.
CREATE ROLE 'desarrollador';

----------------------------
-- Otorgar permisos a rol --
----------------------------
GRANT CREATE, INSERT, SELECT, UPDATE, DELETE, ALTER, DROP, CREATE VIEW, CREATE PROCEDURE, CREATE SEQUENCE
ON catering.* TO 'desarrollador';
FLUSH PRIVILEGES;

---------------------------
-- Otorgar rol a usuario --
---------------------------
GRANT 'desarrollador' TO 'elbicho';
FLUSH PRIVILEGES;

---------------------------
-- Conectar con el usuario --
---------------------------
-- Para conectarse con el usuario en MariaDB, puedes hacer:
-- mysql -u elbicho -p'1234' -h localhost catering
