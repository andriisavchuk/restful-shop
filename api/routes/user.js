const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {

  User.find({ email: req.body.email })
    .exec()
    .then(user => {

      if (user.length >= 1) {
        return res.status(409).json({
          message: 'User with such email is already exists'
        });

      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                })
              })
              .catch(err => {
                res.status(500).json({
                  error: err
            });
          })
        }
      });
    }
  })
});

router.post('/login', (req, res, next) => {

  User.find({ email: req.body.email })
    .exec()
    .then(users => {
        if (users.length < 1) {
          return res.status(401).json({
            message: 'Authorization failed'
          });
        }
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Authorization failed. Password is incorrect'
            });
          }
          if (result) {
            return res.status(200).json({
              message: 'Authorization successfull.'
            });
          }
          res.status(401).json({
            message: 'Authorization failed.'
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
    });
  })
});

router.delete('/:userId', (req, res, next) => {

  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
    });
  });
});

module.exports = router;
