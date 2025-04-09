import express, {Request, Response} from 'express';
import {AppDataSource} from "./data-source";
import {User} from "./entity/user";
import {Book} from "./entity/book";
import {BookBorrowHistory} from "./entity/book-borrow-history";
import {BookScore} from "./entity/book-score";
import {In} from "typeorm";
import {PastItem, PresentItem, UserQueryResponse} from "./dto/user-query-response";

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(async () => {
        // here you can start to work with your database

        const app = express();
        app.use(express.json());
        const port = process.env.PORT || 3000;

        app.get('/', (req: Request, res: Response) => {
            // res.send('Hello, TypeScript Express!');
            const book: Book = { id: 1, name: 'Selam', score: -1 };
            res.json(book);
        });

        // users

        app.get('/users', async (req: Request, res: Response) => {
            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.find();
            res.json(users);
        });

        app.get('/users/:id', async (req: Request, res: Response) => {
            const id = parseInt(req.params.id);
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: id });
            const bookBorrowHistoryRepository = AppDataSource.getRepository(BookBorrowHistory);
            const bookBorrowHistories = await bookBorrowHistoryRepository.find({
                where: {
                    user: { id: id },
                },
                relations: {
                    book: true,
                }
            });
            console.log(bookBorrowHistories);
            const borrowedBookIds = bookBorrowHistories.map(item => item.book.id);
            const bookScoreRepository = AppDataSource.getRepository(BookScore);
            const bookScores = await bookScoreRepository.find({
                where: {
                    user: { id: id },
                    book: { id: In(borrowedBookIds) }
                },
                relations: {
                    book: true,
                }
            });
            console.log(bookScores);
            console.log(bookScores.map(item => item.book.id));
            const bookIdVersusScore = new Map<number, number>();
            bookScores.forEach(item => {
                bookIdVersusScore.set(item.book.id, item.score);
            });
            const pastItems: PastItem[] = [];
            const presentItems: PresentItem[] = [];
            bookBorrowHistories.forEach(item => {
                if (item.returned) {
                    pastItems.push({
                        name: item.book.name,
                        userScore: bookIdVersusScore.get(item.book.id)
                    });
                } else {
                    presentItems.push({
                        name: item.book.name
                    });
                }
            });
            const responseBody: UserQueryResponse = {
                id: user?.id,
                name: user?.name,
                past: pastItems,
                present: presentItems
            };
            res.json(responseBody);
        });

        app.post('/users', async (req: Request, res: Response) => {
            const user = new User();
            user.name = req.body.name;
            const userRepository = AppDataSource.getRepository(User);
            const persistedUser = await userRepository.save(user);
            res.json(persistedUser);
        });

        app.post('/users/:userId/borrow/:bookId', async (req: Request, res: Response) => {
            const userId = parseInt(req.params.userId);
            const bookId = parseInt(req.params.bookId);
            const userRepository = AppDataSource.getRepository(User);
            const bookRepository = AppDataSource.getRepository(Book);
            const bookBorrowHistoryRepository = AppDataSource.getRepository(BookBorrowHistory);
            const user = await userRepository.findOneBy({ id: userId });
            const book = await bookRepository.findOneBy({ id: bookId });
            const bookBorrowHistory = new BookBorrowHistory();
            if (book != null) { // todo: resolve this and remove
                bookBorrowHistory.book = book;
            }
            if (user != null) { // todo: resolve this and remove
                bookBorrowHistory.user = user;
            }
            bookBorrowHistory.returned = false;
            await bookBorrowHistoryRepository.save(bookBorrowHistory);
            res.json();
        });

        app.post('/users/:userId/return/:bookId', async (req: Request, res: Response) => {
            const userId = parseInt(req.params.userId);
            const bookId = parseInt(req.params.bookId);
            const score = parseInt(req.body.score);
            const userRepository = AppDataSource.getRepository(User);
            const bookRepository = AppDataSource.getRepository(Book);
            const bookBorrowHistoryRepository = AppDataSource.getRepository(BookBorrowHistory);
            const bookScoreRepository = AppDataSource.getRepository(BookScore);
            const user = await userRepository.findOneBy({ id: userId });
            const book = await bookRepository.findOneBy({ id: bookId });
            // update book borrow history
            const bookBorrowHistory = await bookBorrowHistoryRepository.findOneBy({ book: { id: bookId }, user: { id: userId } });
            if (bookBorrowHistory != null) { // todo: resolve this and remove
                bookBorrowHistory.returned = true;
                await bookBorrowHistoryRepository.save(bookBorrowHistory);
            }
            // insert book score
            const bookScore = new BookScore();
            if (book != null) { // todo: resolve this and remove
                bookScore.book = book;
            }
            if (user != null) { // todo: resolve this and remove
                bookScore.user = user;
            }
            bookScore.score = score;
            await bookScoreRepository.save(bookScore);
            // update book for new score
            let sumOfScores = 0;
            const bookScores = await bookScoreRepository.findBy({ book: { id: bookId } });
            bookScores.forEach(item => {
                sumOfScores += item.score;
            });
            const newScore = sumOfScores / bookScores.length;
            if (book != null) { // todo: resolve this and remove
                book.score = newScore;
                await bookRepository.save(book);
            }
            res.json();
        });

        // books

        app.get('/books', async (req: Request, res: Response) => {
            const bookRepository = AppDataSource.getRepository(Book);
            const books = await bookRepository.find();
            res.json(books);
        });

        app.get('/books/:id', async (req: Request, res: Response) => {
            const bookRepository = AppDataSource.getRepository(Book);
            const book = await bookRepository.findOneBy({ id: parseInt(req.params.id) });
            res.json(book);
        });

        app.post('/books', async (req: Request, res: Response) => {
            const book = new Book();
            book.name = req.body.name;
            book.score = -1;
            const bookRepository = AppDataSource.getRepository(Book);
            const persistedBook = await bookRepository.save(book);
            res.json(persistedBook);
        });

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error) => console.log(error));
