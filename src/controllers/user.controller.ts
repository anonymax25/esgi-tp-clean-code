import { UserRoles } from "../models/enums/userRoles.enum";
import { User } from "../models/user.model";

export class UserController {

    public async create(login: string, role: UserRoles) {
        const user = new User({
            login,
            role,
            books: []
        });
        await user.save();
        return user;
    }

    public async getAll() {
        return await User.find();
    }

    public async getById(_id) {
        return await User.findOne({ _id });
    }

    public async getByLogin(login) {
        return await User.findOne({ login })
    }
    
    public async delete(_id) {
        return await User.deleteOne({ _id })
    }
}