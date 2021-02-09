import * as express from "express";
import * as bodyParser from "body-parser";
import { LibraryRoutes } from "./routes/library.routes";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { UserRoutes } from "./routes/user.routes.";
import { BookRoutes } from "./routes/book.routes";

class App {
  public app: express.Application;
  public userRoutes: UserRoutes = new UserRoutes();
  public libraryRoutes: LibraryRoutes = new LibraryRoutes();
  public bookRoutes: BookRoutes = new BookRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.userRoutes.routes(this.app);
    this.libraryRoutes.routes(this.app);
    this.bookRoutes.routes(this.app);
  }

  private config(): void {
    this.app.use(LoggerMiddleware.httpLogger());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;