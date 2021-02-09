import * as dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import { DatabaseManager } from '../src/config/database';
import { IUser, User } from '../src/models/user.model';
import { UserRoles } from '../src/models/enums/userRoles.enum';
import { ILibrary } from '../src/models/library.model';
import { ManageBooksType } from '../src/routes/dto/manageBooksDTO.interface';

chai.use(chaiHttp);
const expect = chai.expect;

describe('routes testing', () => {

    before('start server', (done) => {
        let PORT = 3001;
        DatabaseManager.connect(process.env.MONGO_URI, () => {
            app.listen(PORT, () => {
                console.log(`Started server on port : ${process.env.PORT} ...`);
                app.emit("started");
            });
        })
        app.on("started", function(){
            done();
        });
    })


    let user = {
        _id: null,
        login: "maxime",
        role: UserRoles.LIBRARIAN,
        books: []
    } 

    let library = {
        _id: null,
        name: "fizz library",
        books: []
    }
    let book = {
        _id: null,
        title: "Test book",
        author: "Mr sananes"
    }
    step('should create a user', (done) => {
        chai.request(app)
            .post('/user')
            .send(user)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                user = res.body
                done()
            });
    })
    
    step('should see users', (done) => {
        chai.request(app)
            .get('/user')
            .end(function (err, res) {   
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done()
            });
    })

    
    step('should create a library', (done) => {
        chai.request(app)
            .post('/library')
            .set('Authorization', `Bearer ${user.login}`)
            .send(library)
            .end(function (err, res) {                    
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                library = res.body             
                done()
            });
    })
    
    step('should create a book', (done) => {
        chai.request(app)
            .post('/book')
            .set('Authorization', `Bearer ${user.login}`)
            .send(book)
            .end(function (err, res) {    
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                book = res.body                
                done()
            });
    })
    
    step('should add a book to the library', (done) => {
        chai.request(app)
            .put(`/library/${library._id}/books`)
            .set('Authorization', `Bearer ${user.login}`)
            .send({
                type: ManageBooksType.ADD,
                bookId: book._id
            })
            .end(function (err, res) {                    
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done()
            });
    })
    
    step('should delete a library', () => {
        chai.request(app)
            .delete(`/library/${library._id}`)
            .set('Authorization', `Bearer ${user.login}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
            });
    })

    step('should delete a user', () => {
        chai.request(app)
            .delete(`/user/${user.login}`)
            .set('Authorization', `Bearer ${user.login}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
            });
    })
        
});

