import { Request, Response } from "express";
import { BookController } from "../controllers/book.controller";
import { LibraryController } from "../controllers/library.controller";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { Library } from "../models/library.model";
import { IUser } from "../models/user.model";
import { ManageBooksDTO, ManageBooksType } from "./dto/manageBooksDTO.interface";
import { HttpError } from "../utils/router.utils";

export class LibraryRoutes {

    public libraryController: LibraryController = new LibraryController();
    public bookController: BookController = new BookController();
    public userController: UserController = new UserController();

    public routes(app): void {

        app.route("/library").post(AuthMiddleware.isLibrarian(), async (req: Request, res: Response) => {
            if (req.body.name) {
                try {
                    let library = await this.libraryController.create(req.body.name)
                    return res.status(201).json(library);
                } catch (e) {
                    res.status(500).json(e.message);
                }
            }
            return res.status(400).end();
        });

        app.route("/library").get(async (req: Request, res: Response) => {
            let libraries = await Library.find()
            return res.status(200).json(libraries);
        });

        app.route("/library/:id").get(async (req: Request, res: Response) => {
            if (req.params.id) {
                let librarie = await Library.findOne({ _id: req.params.id })
                return res.status(200).json(librarie);
            }
            return res.status(400).end();
        });

        app.route("/library/:id/books").put(AuthMiddleware.isLibrarian(), async (req: Request, res: Response) => {
            let manageBook = req.body as ManageBooksDTO
            if (req.params.id && manageBook.type && manageBook.bookId) {
                let library = null
                switch (manageBook.type) {
                    case ManageBooksType.ADD:
                        library = await this.libraryController.addBook(req.params.id, manageBook.bookId)
                        break;
                    case ManageBooksType.REMOVE:
                        library = await this.libraryController.removeBook(req.params.id, manageBook.bookId)
                        break;
                }
                if (library)
                    return res.status(200).json(library);
                return res.status(404).end();
            }
            return res.status(400).end();
        }); 
        
        app.route("/library/:libraryId/book/:bookId/borrow").put(AuthMiddleware.isMember(), async (req: RequestUser, res: Response) => {            
            if (req.params.libraryId && req.params.bookId) {                
                let book = await this.libraryController.getBookById(req.params.libraryId, req.params.bookId)                
                if(book){
                    let user = req.user
                    if(user.books.length < 4){
                        let library = await this.libraryController.removeBook(req.params.libraryId, req.params.bookId)
                        if(library){
                            user.books.push(book)
                            let resultUser = await user.save()
                            return res.status(200).json(resultUser)
                        }
                        return res.status(500).json(req.user)
                    }
                    return res.status(409).json(new HttpError(409, 'Can\t order more than 4 books'))
                }
                return res.status(404).json(new HttpError(404, 'No book found'))
            }
            return res.status(400).end();
        });

        app.route("/library/:libraryId/book/:bookId/return").put(AuthMiddleware.isMember(), async (req: RequestUser, res: Response) => {
            if (req.params.libraryId && req.params.bookId) {
                let user = req.user
                let returnBookId = user.books.find(book => book.toString() === req.params.bookId)
                let returnBook = await this.bookController.getById(returnBookId)
                if(returnBook){
                    let library = await this.libraryController.addBook(req.params.libraryId, req.params.bookId)
                    if(library){
                        user.books.splice(user.books.indexOf(returnBook),1)
                        let resultUser = await user.save()
                        return res.status(200).json(resultUser)
                    }
                    return res.status(404).json(req.user)
                }
                return res.status(404).end()
            }
            return res.status(400).end();
        });

        app.route("/library/:id").delete(AuthMiddleware.isLibrarian(), async (req: Request, res: Response) => {
            if (req.params.id) {
                let result = await this.libraryController.delete(req.params.id)
                if(result.deletedCount !== 1){
                    return res.status(404).end()
                }
                return res.status(204).end()
            }
            return res.status(400).end();
        });
    }
}
export interface RequestUser extends Request {
    user: IUser
}