export interface UserWithBooksResponse {
    id?: number;
    name?: string;
    books?: PastAndPresentBorrows;
}

export interface PastAndPresentBorrows {
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
