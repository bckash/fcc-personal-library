/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let testID;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: "test title"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body)
          assert.equal(res.body.title, 'test title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          testID = res.body._id
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: ""
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'commentcount');
        assert.property(res.body[0], 'title');
        assert.property(res.body[0], '_id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/64b45a77bd0e6c5df1683666')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/'+testID)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body)
          assert.property(res.body, 'comments');
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+testID)
        .send({
          comment: "test comment"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body)
          assert.isArray(res.body.comments)
          assert.equal(res.body.comments[0], 'test comment');
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/'+testID)
        .send({
          comment: ""
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/64b45a77bd0e6c5df1683666')
        .send({
          comment: "test"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/'+testID)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/64b45a77bd0e6c5df1683666')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });

    });

  });

});
