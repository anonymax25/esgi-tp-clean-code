import * as dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import { DatabaseManager } from '../src/config/database';
import { UserRoles } from '../src/models/enums/userRoles.enum';
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


    let userLibrarian = {
        _id: null,
        login: "maxime",
        role: UserRoles.LIBRARIAN,
        books: []
    } 
    
    let userMember = {
        _id: null,
        login: "yana",
        role: UserRoles.MEMBER,
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

    // Create objects

    step('should create a Librarian', (done) => {
        chai.request(app)
            .post('/user')
            .send(userLibrarian)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                userLibrarian = res.body
                done()
            });
    })
    
    step('should create a Member', (done) => {
        chai.request(app)
            .post('/user')
            .send(userMember)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                userMember = res.body
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
            .set('Authorization', `Bearer ${userLibrarian._id}`)
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
            .set('Authorization', `Bearer ${userLibrarian._id}`)
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
            .set('Authorization', `Bearer ${userLibrarian._id}`)
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
    
    step('user should borrow a book from the library', (done) => {
        chai.request(app)
            .put(`/library/${library._id}/book/${book._id}/borrow`)
            .set('Authorization', `Bearer ${userMember._id}`)
            .end(function (err, res) {        
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                userMember = res.body                      
                expect(userMember.books.length).equals(1)     
                done()
            });
    })
    
    step('user should return a book to the library', (done) => {
        chai.request(app)
            .put(`/library/${library._id}/book/${book._id}/return`)
            .set('Authorization', `Bearer ${userMember._id}`)
            .end(function (err, res) {        
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                userMember = res.body      
                expect(userMember.books.length).equals(0)      
                done()
            });
    })

    // Delete objects
    
    step('should delete a library', () => {
        chai.request(app)
            .delete(`/library/${library._id}`)
            .set('Authorization', `Bearer ${userLibrarian._id}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
            });
    })
    
    step('should delete a book', () => {        
        chai.request(app)
            .delete(`/book/${book._id}`)
            .set('Authorization', `Bearer ${userLibrarian._id}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
            });
    })

    step('should delete userLibrarian', () => {
        chai.request(app)
            .delete(`/user/${userLibrarian._id}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
            });
    })
    
    step('should delete userMember', () => {
        chai.request(app)
            .delete(`/user/${userMember._id}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
            });
    })
        
});

