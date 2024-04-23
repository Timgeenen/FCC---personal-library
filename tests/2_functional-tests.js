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

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  let testId;

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            title: 'New Title'
          })
          .end((err, res) => {
            testId = res.body._id;
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'New Title');
            done();
          })
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isObject(res.body[0]);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'comments');
            assert.isArray(res.body[0].comments);
            assert.property(res.body[0], 'commentcount');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/invalid')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/' + testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments.length, 0);
            assert.equal(res.body._id, testId);
            assert.equal(res.body.title, 'New Title');
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/' + testId)
          .send({
            comment: 'Test POST comment function'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isString(res.body._id);
            assert.equal(res.body._id, testId);
            assert.isString(res.body.title);
            assert.equal(res.body.title, 'New Title');
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments.length, 1);
            assert.equal(res.body.comments[0], 'Test POST comment function');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/' + testId)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'missing required field comment')
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/invalid')
          .send({
            comment: 'invalid id'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            assert.isString(res.text);
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/' + testId)
          .end((err, res) => {
            console.log(res);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            assert.isString(res.text);
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/invalid')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });

    });

  });

});
