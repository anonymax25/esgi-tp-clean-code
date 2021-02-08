import { UserRoles } from "../models/enums/userRoles.enum";
import { User } from "../models/user.model";

export class UserController {

    public async create(login: string, role: UserRoles) {
        const user = new User({
            login,
            role
        });
        await user.save();
        return user;
    }

    public async getAll() {
        return await User.find();
    }

    public async getById(id) {
        const user = await User.findOne({ _id: id });
        return user;
    }
}