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

// Function - create and add movie to database from user input
movieHandler.createMovie = function(request, expressResponse){

  // Assign data from front-end (request.body) to data variable
  const data = request.body;

  // Check if valid data received from user input
  if (
    !data
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

// Function - update an existing movie's data
movieHandler.updateMovie = function(request, expressResponse){
  const {id} = request.params;
  const data = request.body;
  // const userEmail = request.user.email;

  // new - returns updated doc instead of old doc
  // overwrite - overwrites doc completely avoiding unwanted properties/side-effects
  Movie.findById(id)
    .then(movie => {
      if (!movie) {
        return expressResponse.status(404).send('Movie not found');
      }

      // Reactivate once using Auth0
      // if (movie.email !== userEmail) {
      //   return expressResponse.status(403).send('Unauthorized to update this movie');
      // }

      // Proceed with update if the user email matches
      return Movie.findByIdAndUpdate(id, data, { new: true, overwrite: true });
    })
    .then(updatedMovie => {
      expressResponse.status(200).send(updatedMovie);
    })
    .catch(err => {
      console.error(err);
      expressResponse.status(500).send('Internal Server Error, updating movie');
    });
};

// Function - delete a movie from database
movieHandler.deleteMovie = function(request, expressResponse){
  const {id} = request.params;
  // const userEmail = request.user.email;

  // First, find movie and check if it belongs to the user by comparing email
  Movie.findById(id)
    .then(movie => {
      if (!movie) {
        return expressResponse.status(404).send('Movie not found');
      }

      // Reactivate - once have Auth0 that passes in email address
      // if (movie.email !== userEmail) {
      //   return expressResponse.status(403).send('Unauthorized to delete this Movie');
      // }

      // Proceed with deletion if the user email matches
      return Movie.findByIdAndDelete(id);
    })
    .then(deletedMovie => {
      expressResponse.status(200).send(deletedMovie);
    })
    .catch(err => {
      console.error(err);
      expressResponse.status(500).send('Internal Server Error, deleting movie');
    });
};

module.exports = movieHandler;
