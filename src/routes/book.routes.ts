import { Request, Response } from "express";
import { BookController } from "../controllers/book.controller";
import { LibraryController } from "../controllers/library.controller";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { Book } from "../models/book.model";
import { IUser } from "../models/user.model";

export class BookRoutes {

    public libraryController: LibraryController = new LibraryController();
    public bookController: BookController = new BookController();
    public userController: UserController = new UserController();

    public routes(app): void {

        app.route("/book").post(AuthMiddleware.isLibrarian(), async (req: Request, res: Response) => {
            if (req.body.title && req.body.author) {
                try {
                    let book = await this.bookController.create(req.body.title, req.body.author)
                    return res.status(201).json(book);
                } catch (e) {
                    res.status(500).json(e.message);
                }
            }
            return res.status(400).end();
        });

        app.route("/book").get(async (req: Request, res: Response) => {
            let books = await Book.find()
            return res.status(200).json(books);
        });

        app.route("/book/:id").get(async (req: Request, res: Response) => {
            if (req.params.id) {
                let book = await Book.findOne({ _id: req.params.id })
                return res.status(200).json(book);
            }
            return res.status(400).end();
        });

        app.route("/book/:id").delete(AuthMiddleware.isLibrarian(), async (req: Request, res: Response) => {
            if (req.params.id) {
                let result = await this.bookController.delete(req.params.id)
                
                if(result.deletedCount !== 1){
                    return res.status(404).end()
                }
                return res.status(204).end()
            }
            return res.status(400).end();
        });
    }
}