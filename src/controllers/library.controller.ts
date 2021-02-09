import { Book, IBook } from "../models/book.model";
import { Library } from "../models/library.model";

export class LibraryController {

    public async create(name: string) {
        const library = new Library({
            name: name,
            books: []
        });
        await library.save();
        return library;
    }

    public async getAll() {
        return await Library.find();
    }

    public async getById(id) {
        const library = await Library.findOne({ _id: id });
        return library;
    }

    public async addBook(libraryId: string, bookId: string){
        const library = await Library.findOne({ _id: libraryId });
        const book = await Book.findOne({ _id: bookId });
        library.books.push(book)
        return await library.save();
    }
    public async removeBook(libraryId: string, bookId: string){
        const library = await Library.findOne({ _id: libraryId });
        const book = await Book.findOne({ _id: bookId });
        library.books.splice(library.books.indexOf(book),1)
        return await library.save();
    }

    public async delete(login) {
        return await Library.deleteOne({ login })
    }
}