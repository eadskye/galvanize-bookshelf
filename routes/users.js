'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const humps = require('humps');

router.post('/users', (req, res, next) => {
  var myUser;
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
        myUser = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: hashed_password
      };

      return knex('users')
        .insert(myUser, '*');
    })
    .then((users) => {
      const user = users[0];
      delete user.hashed_password;
      res.send(humps.camelizeKeys(user));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
