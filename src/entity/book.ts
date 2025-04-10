import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "book" })
export class Book {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("float")
    score!: number;

    // TODO: It is better to add timestamps.
}
