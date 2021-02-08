const mongoose = require('mongoose');

export class DatabaseManager {

    static async connect(url, successCallback, errorCallback = () => {}) {        
        console.log(`Trying to connect to mongoDB : ${url} ...`);

        await mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            authSource: 'admin'
        },err => {
            if (err) {
                console.log(err);
                errorCallback()
            } else {
                console.log('Connected to DB');
                successCallback()
            }
        });
    }
}