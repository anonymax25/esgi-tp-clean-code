import { IBook } from "../models/book.model";
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

    }
    public async removeBook(libraryId: string, bookId: string){
        
    }
}