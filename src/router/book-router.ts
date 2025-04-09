import {Request, Response, Router} from "express";
import {Book} from "../entity/book";
import {AppDataSource} from "../data-source";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const bookRepository = AppDataSource.getRepository(Book);
    const books = await bookRepository.find();
    res.json(books);
});

router.get('/:id', async (req: Request, res: Response) => {
    const bookRepository = AppDataSource.getRepository(Book);
    const book = await bookRepository.findOneBy({ id: parseInt(req.params.id) });
    res.json(book);
});

router.post('/', async (req: Request, res: Response) => {
    const book = new Book();
    book.name = req.body.name;
    book.score = -1;
    const bookRepository = AppDataSource.getRepository(Book);
    const persistedBook = await bookRepository.save(book);
    res.json(persistedBook);
});

export default router
