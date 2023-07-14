/*
*
*
*       Complete the API routing below
*       
*       
*/
const BookModel = require("../schema").Book

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel
        .find({})
        .then( result => {
          let bookArr = result.map( book => {
            return {
              title: book.title,
              _id: book._id,
              commentcount: book.comment
                ? book.comment.length 
                : 0
            } 
          })
          res.json(bookArr)
        })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      let bookObj = {
        title: title
      }

      if (title) {
        let newbook = BookModel(bookObj)
        newbook
          .save()
          .then( savedBook => res.json({
            _id: savedBook._id,
            title: savedBook.title
          }))
      } else {
        res.send("missing required field title")
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel
        .findById(bookid)
        .then( result => {
          if (result) {
            res.json({
              title: result.title,
              _id: result._id,
              comments: result.comment ? result.comment : []
            })
          } else {
            res.send("no book exists")
          }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment){
        res.send("missing required field comment")

      } else {
        BookModel
          .findById(bookid)
          .then(result => {
            if (!result) {
              res.send("no book exists")
              
            } else {
              result.comment.push(comment)
              result.save()
              res.json({
                title: result.title,
                _id: result._id,
                comments: result.comment ? result.comment : []
              })
            }
          })
      }

    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
