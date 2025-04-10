# library-management-backend-express

## How to create an empty DB 
- docker pull postgres
- docker run -d --name library-management-db -p 5432:5432 -e POSTGRES_PASSWORD=pass123 postgres
- Connect to the DB using SQL client of your choice. I am using DBeaver. Connection params:
  - DB_HOST=localhost
  - DB_PORT=5432
  - DB_USERNAME=postgres
  - DB_PASSWORD=pass123
  - DB_NAME=postgres
- Go to ddl-script.sql. Execute it using your SQL client.
- Go to dml-script.sql. Execute it using your SQL client.

## How to run the app
- git clone https://github.com/eoral/library-management-backend-express.git
- cd library-management-backend-express
- npm install
- npm run start

## Notes
- Node version: v22.14.0
- Npm version: 10.9.2
