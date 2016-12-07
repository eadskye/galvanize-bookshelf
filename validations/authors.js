'use strict';

const express = require('express');
const app = express();

app.post('/users', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    const err = new Error('Email must not be blank');
    err.status = 400;

    return next(err);
  }

  if (!password || password.trim() === '') {
    const err = new Error('Password must not be blank');
    err.status = 400;

    return next(err);
  }

  // ...
});

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res
      .status(err.status)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  console.error(err);
  res.sendStatus(500);
});
