'use strict';

// Require mongoose
const mongoose = require('mongoose');

// Import Schema from movieSchema.js
const movieSchema = require('./movieSchema');

// Create movieModel from Schema
const movieModel = mongoose.model('Movie', movieSchema);

// Export movieModel (to be used in movieHandler)
module.exports = movieModel;
