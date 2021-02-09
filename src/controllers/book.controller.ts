import { Book } from "../models/book.model";


export class BookController {

    public async create(title: string, author: string) {
        const book = new Book({
            title,
            author
        });
        await book.save();
        return book;
    }

    public async getAll() {
        return await Book.find();
    }

    public async getById(id) {
        const library = await Book.findOne({ _id: id });
        return library;
    }

    public async delete(_id) {
        return await Book.deleteOne({ _id })
    }
}