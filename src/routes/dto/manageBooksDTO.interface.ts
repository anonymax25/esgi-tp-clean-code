import { IBook } from "../../models/book.model";

export interface ManageBooksDTO {
    type: ManageBooksType
    bookId: string
}

export enum ManageBooksType {
    ADD = 'ADD',
    REMOVE = 'REMOVE'
}