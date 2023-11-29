'use strict';

// Required dependencies - dotenv, express, cors, mongoose
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Require movieHandler in order to access functions (movieHandler.getAllMovies, movieHandler.createMovies
const movieHandler = require('./Modules/movie-handler');

// Assign mongoDB connection from .env to a varaible 'MONGODB_CONN'
const MONGODB_CONN = process.env.MONGODB_CONN;

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

// CRUD routes for movies
app.get('/movies', movieHandler.getAllMovies);
app.post('/movies', movieHandler.createMovie);
app.delete('/movies/:id', movieHandler.deleteMovie);

// Check if mongoose connection failure or sucess
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Mongoose is connected'));

// Check if port connection is successful
app.listen(PORT, () => console.log(`listening on ${PORT}`));


