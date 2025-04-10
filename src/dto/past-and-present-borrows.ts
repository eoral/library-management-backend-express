import {PastItem, PresentItem} from "./user-query-response";

export interface PastAndPresentBorrows {
    past?: PastItem[];
    present?: PresentItem[];
}
