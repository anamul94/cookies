docker run --name mysql-cookie -e MYSQL_ROOT_PASSWORD=1234 -d -p 3306:3306 mysql:latest
docker exec -it mysql-cookie mysql -u root -p

CREATE DATABASE cookiedb;

USE cookiedb;