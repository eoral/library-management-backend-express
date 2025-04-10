export interface UserQueryResponse {
    id?: number;
    name?: string;
    books?: Books;
}

export interface Books {
    past?: PastBorrow[];
    present?: PresentBorrow[];
}

export interface PastBorrow {
    name?: string;
    userScore?: number;
}

export interface PresentBorrow {
    name?: string;
}
