import {Request, Response, Router} from "express";
import {Book} from "../entity/book";
import {AppDataSource} from "../data-source";
import {User} from "../entity/user";
import {BookBorrowHistory} from "../entity/book-borrow-history";
import {BookScore} from "../entity/book-score";
import {In} from "typeorm";
import {PastItem, PresentItem, UserQueryResponse} from "../dto/user-query-response";
import UserService from "../service/user-service";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.json(users);
});

router.get('/:id', async (req: Request, res: Response) => {
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

router.post('/', async (req: Request, res: Response) => {
    const user = new User();
    user.name = req.body.name;
    const userRepository = AppDataSource.getRepository(User);
    const persistedUser = await userRepository.save(user);
    res.json(persistedUser);
});

router.post('/:userId/borrow/:bookId', async (req: Request, res: Response) => {
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

router.post('/:userId/return/:bookId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);
    const score = parseInt(req.body.score);
    await UserService.returnBook(bookId, userId, score);
    // const userRepository = AppDataSource.getRepository(User);
    // const bookRepository = AppDataSource.getRepository(Book);
    // const bookBorrowHistoryRepository = AppDataSource.getRepository(BookBorrowHistory);
    // const bookScoreRepository = AppDataSource.getRepository(BookScore);
    // const user = await userRepository.findOneBy({ id: userId });
    // const book = await bookRepository.findOneBy({ id: bookId });
    // // update book borrow history
    // const bookBorrowHistory = await bookBorrowHistoryRepository.findOneBy({ book: { id: bookId }, user: { id: userId } });
    // if (bookBorrowHistory != null) { // todo: resolve this and remove
    //     bookBorrowHistory.returned = true;
    //     await bookBorrowHistoryRepository.save(bookBorrowHistory);
    // }
    // // insert book score
    // const bookScore = new BookScore();
    // if (book != null) { // todo: resolve this and remove
    //     bookScore.book = book;
    // }
    // if (user != null) { // todo: resolve this and remove
    //     bookScore.user = user;
    // }
    // bookScore.score = score;
    // await bookScoreRepository.save(bookScore);
    // // update book for new score
    // let sumOfScores = 0;
    // const bookScores = await bookScoreRepository.findBy({ book: { id: bookId } });
    // bookScores.forEach(item => {
    //     sumOfScores += item.score;
    // });
    // const newScore = sumOfScores / bookScores.length;
    // if (book != null) { // todo: resolve this and remove
    //     book.score = newScore;
    //     await bookRepository.save(book);
    // }
    res.json();
});

export default router
