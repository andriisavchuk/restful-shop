const express = require('express');
const app = express();

// Listening of the requests
app.use((req, res, next) => {
  res.status(200).json({
    message: 'Initial settings'
  });
});

module.exports = app;
