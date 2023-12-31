'use strict';

// Required dependencies - dotenv, express, cors, mongoose
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const verifyUser = require('./Modules/authorize');

// Require movieHandler in order to access functions (movieHandler.getAllMovies, movieHandler.createMovies
const movieHandler = require('./Modules/movie-handler');

// Assign mongoDB connection from .env to a varaible 'MONGODB_CONN'
const MONGODB_CONN = process.env.MONGODB_CONN;

// Require gptMovies for gpt api calls
const getGptMovies = require('./Modules/gptMovies');

// Add middleware - Assign express to variable 'app' and use with '.use'
const app = express();
app.use(cors());
app.use(express.json());

// Assign port from .env to variable
const PORT = process.env.PORT;

// Connect to mongoose, and assign connection to variable 'db'
mongoose.connect(MONGODB_CONN);
const db = mongoose.connection;

// Default route check - functioning (get request in thunder client -- http://localhost:3001)
app.get('/', (req,res) => res.status(200).send('Default Route Working'));

// Check if user is legitimate 
app.use(verifyUser);

// CRUD routes for movies
app.get('/movies', movieHandler.getAllMovies);
app.post('/movies', movieHandler.createMovie);
app.put('/movies/:id', movieHandler.updateMovie);
app.delete('/movies/:id', movieHandler.deleteMovie);

// ChatGPT api call
app.get('/gpt-movies', getGptMovies);

// Check if mongoose connection failure or sucess
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Mongoose is connected'));

// Check if port connection is successful
app.listen(PORT, () => console.log(`listening on ${PORT}`));


