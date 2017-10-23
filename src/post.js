const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  // TODO: write your schema here
  soID: {
    type: Number,
    required: [true, 'Need an soID'],
  },
  parentID: {
    type: Number,
    required: false,
  },
  url: {
    type: String,
    required: [true, 'Need a url!'],
  },
  title: {
    type: String,
    required: false,
  },
  body: {
    type: String,
    required: [true, 'Need a body!'],
  },
  score: {
    type: Number,
    required: [true, 'Need a score!'],
  },
  tags: {
    type: [String],
    required: false,
  },
  acceptedAnswerID: {
    type: Number,
    required: false,
  },
  user: {
    soUserID: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    reputation: {
      type: Number,
      required: false,
    },
  },
});

module.exports = mongoose.model('Posts', PostSchema);
