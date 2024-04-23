/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const bookSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: [String]
  },
  commentcount: {
    type: Number,
    default: 0
  }
})

const Book = mongoose.model('Book', bookSchema);

// const clear = () => Book.deleteMany({});
// clear();

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        //response will be array of book objects
        let books = await Book.find(req.query).select({__v: 0});
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        res.send(books);
      }
      catch (err) {
        console.log(err);
      }
    })
    
    .post(async (req, res) => {
      try {
        let title = req.body.title;
        if (!title) {return res.send('missing required field title')}
        //response will contain new book object including atleast _id and title
        let book = new Book ({
          title: title
        });
        book.save();
        res.send({_id: book._id, title: book.title});
      }
      catch (err) {
        console.log(err);
      }
    })
    
    .delete(async (req, res) => {
      try {
        let deleted = Book.deleteMany({});
        if (!deleted) {
          res.send({ error: 'could not delete book' })
        }
        else {
          //if successful response will be 'complete delete successful'
          res.send('complete delete successful')
        };
      }
      catch (err) {
        console.log(err)
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
        try {
          let bookid = req.params.id;
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
          let book = await Book.findById(bookid);
          console.log(book)
          if (!book) {return res.send('no book exists')};
          res.send({
            _id: book._id,
            title: book.title,
            comments: book.comments
          });
        }
        catch (err) {
          console.log(err);
          res.send('no book exists');
        };
    })
    
    .post(async (req, res) => {
      try {
        let bookid = req.params.id;
        let book = await Book.findById(bookid)
        let comment = req.body.comment;
        if (!comment) { return res.send('missing required field comment') };
        if (!book) { return res.send('no book exists') }
        book.comments.push(comment);
        book.commentcount++
        book.save()
        //json res format same as .get
        res.send({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      }
      catch (err) {
        console.log(err);
        res.send('no book exists')
      };
    })
    
    .delete(async (req, res) => {
      try {
        let bookid = req.params.id;
        //if successful response will be 'delete successful'
        let book = await Book.findByIdAndDelete(bookid);
        if (!book) { return res.send('no book exists') };
        res.send('delete successful');
      }
      catch (err) {
        console.log(err);
        res.send('no book exists')
      };
    });
  
};
