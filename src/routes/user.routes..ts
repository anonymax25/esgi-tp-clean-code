import { Request, Response } from "express";
import { BookController } from "../controllers/book.controller";
import { LibraryController } from "../controllers/library.controller";
import { UserController } from "../controllers/user.controller";
import { UserRoles } from "../models/enums/userRoles.enum";
import { IUser, User } from "../models/user.model";

export class UserRoutes {

    public libraryController: LibraryController = new LibraryController();
    public bookController: BookController = new BookController();
    public userController: UserController = new UserController();

    public routes(app): void {

        app.route("/user").post(async (req: Request, res: Response) => {

            if (req.body.login && req.body.role) {

                if(!Object.values(UserRoles).includes(req.body.role))
                    return res.status(400).json(new HttpError(400, "Role dosen't exist"));

                try {
                    let user = await this.userController.create(req.body.login, req.body.role)
                    return res.status(201).json(user);
                } catch (e) {
                    res.status(500).json(e.message);
                }
            }
            return res.status(400).end();
        });
        
        app.route("/user/:id").delete(async (req: Request, res: Response) => {

            if (req.params.id) {
                let result = await this.userController.delete(req.params.id)
                if(result.deletedCount !== 1){
                    return res.status(404).end()
                }
                return res.status(204).end()
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
                if(user)
                    return res.status(200).json(user);
                return res.status(404).end();
            }
            return res.status(400).end();
        });

    }
}

export class HttpError {
    constructor(public httpStatus: number, public message: string) {}
}

export interface RequestUser extends Request {
    user: IUser
}