export interface UserQueryResponse {
    id?: number;
    name?: string;
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
