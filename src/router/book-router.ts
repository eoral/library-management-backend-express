import {Request, Response, Router} from "express";
import BookService from "../service/book-service";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const books = await BookService.getAllBooks();
    res.json(books);
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const book = await BookService.getBookById(id);
    res.json(book);
});

router.post('/', async (req: Request, res: Response) => {
    const name = req.body.name;
    const book = await BookService.createBook(name);
    res.json(book);
});

export default router
