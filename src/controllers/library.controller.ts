import { Book, IBook } from "../models/book.model";
import { Library } from "../models/library.model";
import { BookController } from "./book.controller";

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

    public async getById(_id: string) {
        return await Library.findOne({ _id });
    }

    public async addBook(libraryId: string, bookId: string){
        const library = await Library.findOne({ _id: libraryId });
        const book = await Book.findOne({ _id: bookId });
        if(library && book){
            library.books.push(book)
            return await library.save();
        }
        return null
    }
    public async removeBook(libraryId: string, bookId: string){
        const library = await Library.findOne({ _id: libraryId });
        const book = await Book.findOne({ _id: bookId });
        library.books.splice(library.books.indexOf(book),1)
        return await library.save();
    }

    public async delete(_id: string) {
        return await Library.deleteOne({ _id })
    }
    
    public async getBookById(libraryId: string, bookId: string) {
        let library = await (await Library.findOne({_id: libraryId}))
        
        let bookIds = Array.from(library.books) as Array<any>
        
        if(library){            
            let foundBookId = bookIds.find(bookIdSearch => bookIdSearch.toString() === bookId)
            return await Book.findOne({ _id: foundBookId});
        }
        return null;
    }
}