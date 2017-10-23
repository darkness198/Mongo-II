const fs = require('fs');

let savedPosts = null;

const Post = require('./post.js');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
  // TODO: implement this
  const postFulPromise = () => {
    const allPosts = readPosts();
    const postPromises = allPosts.map(post => new Post(post).save());
    return Promise.all(postPromises);
  };

  return postFulPromise()
    .then(() => {
      console.log('done');
    })
    .catch((err) => {
      console.log('ERROR', err);
      throw new Error(err);
    });
};

module.exports = { readPosts, populatePosts };
