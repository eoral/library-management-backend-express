import {PastBorrow, PresentBorrow} from "./user-query-response";

export interface PastAndPresentBorrows {
    past?: PastBorrow[];
    present?: PresentBorrow[];
}
