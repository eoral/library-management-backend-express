import "reflect-metadata";
import {DataSource} from "typeorm";
import {User} from "./entity/user";
import {Book} from "./entity/book";
import {BookBorrowHistory} from "./entity/book-borrow-history";
import {BookScore} from "./entity/book-score";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "pass123",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [User, Book, BookBorrowHistory, BookScore],
    subscribers: [],
    migrations: [],
});
