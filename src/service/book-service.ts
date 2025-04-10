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
        const bookRepository = AppDataSource.getRepository(Book);
        const existingBook = await bookRepository.findOneBy({ name: name });
        if (existingBook) {
            throw new Error('Already Exists');
        }
        const book = new Book();
        book.name = name;
        book.score = -1;
        return await bookRepository.save(book);
    }
}

export default new BookService();
