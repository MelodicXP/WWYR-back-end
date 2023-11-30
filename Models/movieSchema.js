// Require mongoose
const mongoose = require('mongoose');

// Destructure Schema from mongoose
const {Schema} = mongoose;

// Set up Schema with properties desired
const MovieSchema = new Schema({
  userName: {
    type:String,
    required: false
  },
  email: {
    type:String,
    required: false
  },
  movieName: {
    type:String,
    required: true
  },
  genre: {
    type: String,
    enum: ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'],
    required: true,
  },
  userComment: {
    type: String,
    required: true,
  },
  videoLink: {
    type: String,
    required: true,
  }
});

// Export Schema (to be used in movieModel.js)
module.exports = MovieSchema;
