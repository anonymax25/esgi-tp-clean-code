export class LoggerMiddleware {

    static httpLogger() {
        return async function(req, res, next){
            //console.log(`${req.method} : ${req.url}`)
            next();
        }
    }
}