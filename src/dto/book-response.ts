import {Book} from "../entity/book";

export interface BookResponse {
    id?: number;
    name?: string;
    score?: number;
}

export function fromEntity(entity: Book): BookResponse {
    return {
        id: entity.id,
        name: entity.name,
        score: entity.score
    };
}
