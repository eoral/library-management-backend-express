import {User} from "../entity/user";

export interface UserResponse {
    id?: number;
    name?: string;
}

export function fromEntity(entity: User): UserResponse {
    return {
        id: entity.id,
        name: entity.name
    };
}
