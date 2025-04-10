import {AppDataSource} from "../data-source";
import BookService from "./book-service";
import {User} from "../entity/user";
import {BookBorrowHistory} from "../entity/book-borrow-history";
import {BookScore} from "../entity/book-score";

class UserService {

    async getAllUsers(): Promise<User[]> {
        const userRepository = AppDataSource.getRepository(User);
        return await userRepository.find();
    }

    async getUserById(id: number): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: id });
        if (user) {
            return user;
        } else {
            throw new Error('Not Found');
        }
    }

    async getNotReturnedBookBorrowHistory(bookId: number, userId: number): Promise<BookBorrowHistory | null> {
        const bookBorrowHistoryRepository = AppDataSource.getRepository(BookBorrowHistory);
        return await bookBorrowHistoryRepository.findOneBy({
            book: { id: bookId },
            user: { id: userId },
            returned: false
        });
    }

    async borrowBook(bookId: number, userId: number): Promise<void> {
        const user = await this.getUserById(userId);
        const book = await BookService.getBookById(bookId);
        const existingBookBorrowHistory = await this.getNotReturnedBookBorrowHistory(bookId, userId);
        if (existingBookBorrowHistory) {
            throw new Error('Already Borrowed');
        }
        const bookBorrowHistoryRepository = AppDataSource.getRepository(BookBorrowHistory);
        const bookBorrowHistory = new BookBorrowHistory();
        bookBorrowHistory.book = book;
        bookBorrowHistory.user = user;
        bookBorrowHistory.returned = false;
        await bookBorrowHistoryRepository.save(bookBorrowHistory);
    }

    // It is better to consider thread-safety in this method.
    async calculateNewScore(bookId: number, additionalScore: number): Promise<number> {
        const bookScoreRepository = AppDataSource.getRepository(BookScore);
        const bookScores = await bookScoreRepository.findBy({
            book: { id: bookId }
        });
        let sumOfScores = additionalScore;
        bookScores.forEach(item => {
            sumOfScores += item.score;
        });
        return sumOfScores / (bookScores.length + 1);
    }

    async returnBook(bookId: number, userId: number, score: number): Promise<void> {
        const user = await this.getUserById(userId);
        const book = await BookService.getBookById(bookId);
        const bookBorrowHistory = await this.getNotReturnedBookBorrowHistory(bookId, userId);
        if (!bookBorrowHistory) {
            throw new Error('Not Borrowed');
        }
        // DB change-1
        bookBorrowHistory.returned = true;
        // DB change-2
        const bookScore = new BookScore();
        bookScore.book = book;
        bookScore.user = user;
        bookScore.score = score;
        // DB change-3
        book.score = await this.calculateNewScore(bookId, score);
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.save(bookBorrowHistory);
            await transactionalEntityManager.save(bookScore);
            await transactionalEntityManager.save(book);
        });
    }
}

export default new UserService();
