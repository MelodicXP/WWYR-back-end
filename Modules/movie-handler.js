'use strict';

// Import movieModel from movieModel.js
const Movie = require('../Models/movieModel');

const movieHandler = {};

// Function - get all movies not equal to user email
movieHandler.getAllMovies = function(request, expressResponse){

  // Set property of user email
  // let queryObject = {email: request.user.email};
  let queryObject = {}; // deactivate this and re-activate with email once Autho0 established

  Movie.find(queryObject) // Find data by user email
    .then(data => {
      if (data) {
        expressResponse.status(200).send(data);
      } else {
        // If no movies found, respond with 404
        expressResponse.status(404).send('No movies found');
      }
    })
    .catch(err => {
      // Log the error and send a 500 Internal Server Error response
      console.error(err);
      expressResponse.status(500).send('Internal Server Error, getting movies');
    });
};

// Function - create and add movies to database from user input
movieHandler.createMovies = function(request, expressResponse){

  // Assign data from front-end (request.body) to data variable
  const data = request.body;

  // Check if valid data received from user input
  if (
    !data ||
    !data.userName ||
    !data.email ||
    !data.movieName ||
    !data.genre ||
    !data.userComment ||
    !data.videoLink
  ) {
    // Validate request body for required movie data
    return expressResponse.status(400).send('Invalid movie data');
  }

  // Add user email property to movie data
  // let movieDataWithEmailAdded = {...data, email: request.user.email}; ---> Add to Movie.create(movieDatawithEmailAdded)

  // Create new movie from data along with user email and send back confirmation if data created successfully
  Movie.create(data) // --> change to movie.Create(movieDataWithEmailAdded) once Auth0
    .then(createdMovie => expressResponse.status(201).send(createdMovie))
    .catch(err => {
      // Log error and send a 500 Internal Server Error response
      console.error(err);
      expressResponse.status(500).send('Internal Server Error, creating movie');
    });
};

module.exports = movieHandler;
