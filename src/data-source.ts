import dotenv from 'dotenv';
import "reflect-metadata";
import {DataSource} from "typeorm";
import {User} from "./entity/user";
import {Book} from "./entity/book";
import {BookBorrowHistory} from "./entity/book-borrow-history";
import {BookScore} from "./entity/book-score";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false,
    logging: true,
    entities: [User, Book, BookBorrowHistory, BookScore],
    subscribers: [],
    migrations: [],
});
