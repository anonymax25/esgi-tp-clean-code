import { IBook } from "../../models/book.model";

export interface ManageBooksDTO {
    type: ManageBooksType
    book: IBook
}

export enum ManageBooksType {
    CREATE = 'CREATE',
    DELETE = 'DELETE'
}