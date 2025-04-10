import {Request, Response, Router} from "express";
import {UserWithBooksResponse} from "../dto/user-with-books-response";
import UserService from "../service/user-service";
import {fromEntity} from "../dto/user-response";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.json(users.map(user => fromEntity(user)));
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await UserService.getUserById(id);
    const pastAndPresentBorrows = await UserService.getPastAndPresentBorrows(id);
    const responseBody: UserWithBooksResponse = {
        id: user.id,
        name: user.name,
        books: {
            past: pastAndPresentBorrows.past,
            present: pastAndPresentBorrows.present
        }
    };
    res.json(responseBody);
});

router.post('/', async (req: Request, res: Response) => {
    const name = req.body.name;
    const user = await UserService.createUser(name);
    res.json(fromEntity(user));
});

router.post('/:userId/borrow/:bookId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);
    await UserService.borrowBook(bookId, userId);
    res.json();
});

router.post('/:userId/return/:bookId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const bookId = parseInt(req.params.bookId);
    const score = parseFloat(req.body.score);
    await UserService.returnBook(bookId, userId, score);
    res.json();
});

export default router
