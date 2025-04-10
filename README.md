# library-management-backend-express

## How to create an empty DB 
- docker pull postgres
- docker run -d --name library-management-db -p 5432:5432 -e POSTGRES_PASSWORD=pass123 postgres
- Connect to the DB using SQL client of your choice. I am using DBeaver.
- Go to ddl-script.sql. Execute it using your SQL client.
- Go to dml-script.sql. Execute it using your SQL client.

## How to run the app
- git clone https://github.com/eoral/library-management-backend-express.git
- cd library-management-backend-express
- npm install
- npm run start

