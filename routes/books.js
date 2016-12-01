'use strict';

var express = require('express');
var router = express.Router();
var boom = require('boom');
var knex = require('../knex');
var { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      var books = camelizeKeys(rows);
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((rows) => {
    var books = camelizeKeys(rows);
    if (!rows) {
      return next();
    }

    res.send(books);
  })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  const { title, author, genre, description, coverUrl } = req.body;

    if (!title || !title.trim()) {
      // res.status(400).send("Name must not be blank.")
      next(boom.create(400, 'Title must not be blank.'));
      return;
    }

    const insertBook = decamelizeKeys({ title, author, genre, description, coverUrl });

  knex('books')
    .insert(insertBook, '*')
    .then((rows) => {

const book = camelizeKeys(rows[0]);
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
const { title, author, genre, description, coverUrl } = req.body;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
const updateBook= decamelizeKeys({ title, author, genre, description, coverUrl});
      return knex('books')
        .update(updateBook, '*')
        .where('id', req.params.id);
    })
    .then((rows) => {
      const book= camelizeKeys(rows[0]);
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});
router.delete('/books/:id', (req, res, next) => {
 let book;

 knex('books')
   .where('id', req.params.id)
   .first()
   .then((row) => {
     if (!row) {
       return next();
     }

     book = row;

     return knex('books')
       .del()
       .where('id', req.params.id);
   })
   .then(() => {
     delete book.id;
     delete book.created_at;
     delete book.updated_at;
     res.send(camelizeKeys(book));
   })
   .catch((err) => {
     next(err);
   });
});

module.exports = router;
