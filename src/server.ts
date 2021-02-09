import * as dotenv from 'dotenv';
dotenv.config();
import app from "./app";
import { DatabaseManager } from "./config/database";

const PORT = process.env.PORT || 3001;

DatabaseManager.connect(process.env.MONGO_URI, () => {
    app.listen(PORT, () => {
        app.emit("started");
        console.log(`Started server on port : ${process.env.PORT} ...`);
    });
})
