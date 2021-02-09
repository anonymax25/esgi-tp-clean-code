import { UserController } from "../controllers/user.controller";
import { UserRoles } from "../models/enums/userRoles.enum";
import { User } from "../models/user.model";

export class AuthMiddleware {
    
    static isLibrarian() {
        return async function(req, res, next){
            const authorization = req.headers['authorization'];
            if(!authorization || !authorization.startsWith('Bearer ')){
                res.status(401).end();
                return;
            }
            const token = authorization.slice(7);
            const user = await new UserController().getByLogin(token);
            if(!user) {
                res.status(403).end();
                return;
            }

            if(user.role !== UserRoles.LIBRARIAN) {
                res.status(403).end();
                return;
            }
            req.user = user;
            next();
        }
    }
    
    static isMember() {
        return async function(req, res, next){
            return async function(req, res, next){
                const authorization = req.headers['authorization'];
                if(!authorization || !authorization.startsWith('Bearer ')){
                    res.status(401).end();
                    return;
                }
                const token = authorization.slice(7);
                const user = await new UserController().getByLogin(token);
                if(!user) {
                    res.status(403).end();
                    return;
                }
    
                if(user.role !== UserRoles.MEMBER) {
                    res.status(403).end();
                    return;
                }
                req.user = user;
                next();
            }
        }
    }
}