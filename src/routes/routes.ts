import { Request, Response } from "express";
import { BookController } from "../controllers/book.controller";
import { LibraryController } from "../controllers/library.controller";
import { UserController } from "../controllers/user.controller";
import { Book } from "../models/book.model";
import { Library } from "../models/library.model";
import { User } from "../models/user.model";
import { ManageBooksDTO, ManageBooksType } from "./dto/manageBooksDTO.interface";

export class Routes {

    public libraryController: LibraryController = new LibraryController();
    public bookController: BookController = new BookController();
    public userController: UserController = new UserController();

    public routes(app): void {

        //library

        app.route("/library").post(async (req: Request, res: Response) => {
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

        app.route("/library/:id/books").put(async (req: Request, res: Response) => {
            let manageBook = req.body as ManageBooksDTO
            if (req.params.id) {
                let library = null
                switch (manageBook.type) {
                    case ManageBooksType.CREATE:
                        library = await this.libraryController.addBook(req.params.id, manageBook.book._id)
                        break;
                    case ManageBooksType.DELETE:
                        library = await this.libraryController.removeBook(req.params.id, manageBook.book._id)
                        break;
                }
                if (library)
                    return res.status(200).json(library);
                return res.status(404).json(library);
            }
        });

        //Book

        app.route("/book").post(async (req: Request, res: Response) => {
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

        // User

        app.route("/user").post(async (req: Request, res: Response) => {
            if (req.body.login && req.body.role) {
                try {
                    let user = await this.userController.create(req.body.login, req.body.role)
                    return res.status(201).json(user);
                } catch (e) {
                    res.status(500).json(e.message);
                }
            }
            return res.status(400).end();
        });

        app.route("/user").get(async (req: Request, res: Response) => {
            let users = await User.find()
            return res.status(200).json(users);
        });

        app.route("/user/:id").get(async (req: Request, res: Response) => {
            if (req.params.id) {
                let user = await User.findOne({ _id: req.params.id })
                return res.status(200).json(user);
            }
            return res.status(400).end();
        });

    }
}