'use strict';

const axios = require('axios');
const cache = require('./cache');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI API Call with prompt
async function getGptMovies(request, expressResponse, next) {

  //Convert nameOfMovie back into original form (comes in 'The_Matrix' convert back to 'The Matrix)
  const nameOfMovie = request.query.nameOfMovie.replace(/_/g, ' ');
  console.log(nameOfMovie);

  // Open AI - API url
  const url = 'https://api.openai.com/v1/chat/completions';

  // Store 24 hour time frame
  const twentyFourHoursInMs = 86400000;

  // Key for movie recommendations stored in cache - prevent multiple API calls on repeated film 
  const key = `gpt-movie-recommendations-${nameOfMovie}`;

  // If key matches in cache and timestamp is less than 24 hours, use cache data
  if ( cache[key] && (Date.now() - cache[key].timestamp < twentyFourHoursInMs) ) {
    console.log('cache hit - sending data from cache');

    const responseData = { data: cache[key].data };
    console.log("Sending back cached data:", responseData);
    expressResponse.status(200).send(responseData);

  } else {
    console.log('cache miss - making a new request');
    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You are a movie expert that makes awesome recommendations."
        },
        {
          "role": "user",
          "content": `Please recommend me 5 movies similar to ${nameOfMovie} and list them in bullet points.`
        }
      ],
      temperature: 0.7
    };
    try {
      const axiosResponse = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // Accessing the 'content' property from the API response
      if (axiosResponse.data.choices && axiosResponse.data.choices.length > 0 && axiosResponse.data.choices[0].message) {
        const content = axiosResponse.data.choices[0].message.content;

        // Splitting the content into individual movies
        const recommendations = content.trim().split('\n').filter(movie => movie.trim() !== '');

        // Add time stamp to data
        const timeStamp = Date.now();
        cache[key] = { data: recommendations, timestamp: timeStamp };

        // Send back data as json (object)
        const responsePayload = { data: recommendations };
        console.log("Sending response:", responsePayload);
        expressResponse.status(200).send(responsePayload);
      } else {
        // Handle where the expected data is not present
        console.log('Unexpected response structure:', axiosResponse.data);
        next({ message: 'Unexpected response structure from OpenAI' });
      }
    }  catch (error) {
      console.error('Error making OpenAI request:', error.response ? error.response.data : error);
      next({ message: 'Internal Server Error, unable to get movie recommendations' });
    }
  }
}

module.exports = getGptMovies;