import express from 'express';
import dotenv from 'dotenv';
import {AppDataSource} from "./data-source";
import {default as bookRouter} from "./router/book-router";
import {default as userRouter} from "./router/user-router";

dotenv.config();

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(async () => {
        // here you can start to work with your database
        const port = process.env.PORT || 3000;
        const app = express();
        app.use(express.json());
        app.use('/books', bookRouter);
        app.use('/users', userRouter);
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error) => console.log(error));
