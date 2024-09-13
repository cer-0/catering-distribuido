-- Creación de Tablespace (equivalente en MariaDB sería usar una base de datos)
-- Crear la base de datos (si aún no existe)
CREATE DATABASE IF NOT EXISTS catering;
USE catering;

-------------------------
-- Crear el usuario (si aún no existe)
-------------------------
CREATE USER IF NOT EXISTS 'usuario'@'localhost' IDENTIFIED BY '1234';

-- Otorgar privilegios al usuario
GRANT ALL PRIVILEGES ON catering.* TO 'usuario'@'localhost';

-- Aplicar los cambios de privilegios
FLUSH PRIVILEGES;

---------------------
-- Crear el rol (si aún no existe)
---------------------
DROP ROLE IF EXISTS 'desarrollador';
CREATE ROLE 'desarrollador';

----------------------------
-- Otorgar permisos al rol
----------------------------
GRANT CREATE, INSERT, SELECT, UPDATE, DELETE, ALTER, DROP, CREATE VIEW
ON catering.* TO 'desarrollador';
GRANT SELECT ON mysql.user TO 'usuario'@'localhost';
FLUSH PRIVILEGES;

-- Aplicar los cambios de privilegios
FLUSH PRIVILEGES;

---------------------------
-- Otorgar rol al usuario
---------------------------
GRANT 'desarrollador' TO 'usuario'@'localhost';

-- Aplicar los cambios de privilegios
FLUSH PRIVILEGES;

---------------------------
-- Conectar con el usuario --
---------------------------
-- Para conectarse con el usuario en MariaDB, puedes hacer:
-- mysql -u usuario -p'1234' -h localhost catering
