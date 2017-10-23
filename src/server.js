const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const idToAns = 0;
const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
  if (Number.isNaN(Number(req.params.soID))) {
    res.status(STATUS_USER_ERROR).json({ err: 'bad stuff put in!' });
    return;
  }
  Post.where('soID', req.params.soID)
    .where('parentID')
    .equals(null)
    .select('acceptedAnswerID')
    .exec((err, query) => {
      if (!query[0]) {
        res.status(STATUS_USER_ERROR).json({ err: 'none to find!' });
        return;
      }
    })
    .then((que) => {
      Post.where('soID', que[0].acceptedAnswerID)
        .and([{ parentID: req.params.soID }])
        .exec((err, post) => {
          if (err) {
            throw new Error(err);
          }
          res.json(post[0]);
        });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  if (Number.isNaN(Number(req.params.soID))) {
    res.status(STATUS_USER_ERROR).json({ err: 'bad stuff put in!' });
    return;
  }
  Post.where('soID', req.params.soID)
    .where('parentID', null)
    .select('acceptedAnswerID')
    .exec((err, query) => {
      if (!query[0]) {
        res.status(STATUS_USER_ERROR).json({ err: 'none to find!' });
        return;
      }
    })
    .then((que) => {
      Post.where('parentID', req.params.soID)
        .and([{ parentID: req.params.soID }])
        .ne('soID', que[0].acceptedAnswerID)
        .sort({ score: 'desc' })
        .exec((err, posts) => {
          res.json(posts[0]);
        });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: { $in: ['jquery'] } })
    .or([{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }])
    .exec((err, questions) => {
      res.json(questions);
    });
});

server.get('/npm-answers', (req, res) => {
  const ansArr = [];
  let newArr = [];
  Post.find({ tags: { $in: ['npm'] } })
    .select('soID')
    .exec((err, ids) => {
      ids.forEach((id) => {
        ansArr.push(id.soID);
      });
    })
    .then(() => {
      Post.where()
        .exec((err, posts) => {
          newArr = posts.filter((post) => {
            for (let i = 0; i < ansArr.length; i++) {
              if (ansArr[i] === post.parentID) {
                return true;
              }
            }
            return false;
          });
        })
        .then(() => {
          res.json(newArr);
        });
    });
});

module.exports = { server };
