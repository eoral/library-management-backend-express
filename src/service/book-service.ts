import {AppDataSource} from "../data-source";
import {Book} from "../entity/book";

class BookService {

    async getAllBooks(): Promise<Book[]> {
        const bookRepository = AppDataSource.getRepository(Book);
        return await bookRepository.find();
    }

    async getBookById(id: number): Promise<Book> {
        const bookRepository = AppDataSource.getRepository(Book);
        const book = await bookRepository.findOneBy({ id: id });
        if (book) {
            return book;
        } else {
            throw new Error('Not Found');
        }
    }

    async createBook(name: string): Promise<Book> {
        const book = new Book();
        book.name = name;
        book.score = -1;
        const bookRepository = AppDataSource.getRepository(Book);
        return await bookRepository.save(book);
    }
}

export default new BookService();
