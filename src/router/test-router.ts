import {Request, Response, Router} from "express";
import {Book} from "../entity/book";

const router = Router();

// router.get("/", (req, res) => {
//     res.send("Hello World!");
// });

router.get('/', (req: Request, res: Response) => {
    // res.send('Hello, TypeScript Express!');
    const book: Book = { id: 1, name: 'Selam', score: -1 };
    res.json(book);
});

export default router
