import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Book} from "./book";
import {User} from "./user";

@Entity({ name: "book_borrow_history" })
export class BookBorrowHistory {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Book)
    @JoinColumn({ name: "book_id" })
    book!: Book;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @Column()
    returned!: boolean;
}
