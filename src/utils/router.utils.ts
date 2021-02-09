import { IUser } from "../models/user.model";

export class HttpError {
    constructor(public httpStatus: number, public message: string) {}
}

export interface RequestUser extends Request {
    user: IUser
}