export interface UserQueryResponse {
    id?: number;
    name?: string;
    past?: PastItem[];
    present?: PresentItem[];
}

export interface PastItem {
    name?: string;
    userScore?: number;
}

export interface PresentItem {
    name?: string;
}
