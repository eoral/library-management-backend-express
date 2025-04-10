import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "user" })
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
    
    // TODO: It is better to add timestamps.
}
