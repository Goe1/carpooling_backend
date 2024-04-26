const express = require('express');
const router = express.Router();
const axios = require('axios');
// Text Search route
router.get('/textsearch', async (req, res) => {
    const { query, itemCount } = req.query;
    const bearerToken='51143068-f181-4e99-bba4-52059d1891fe'
    
    try {
      const response = await axios.get(`https://atlas.mapmyindia.com/api/places/textsearch/json?query=${query}&itemCount=${itemCount}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching text search results:', error);
      res.status(500).json({ error: 'An error occurred while fetching text search results' });
    }
  });
  
  // Distance Matrix route
  router.get('/distancematrix', async (req, res) => {
    // Extract required parameters from the query string
    const { origins, destinations } = req.query;
    const apiKey = '1e8ff58f4c5cf1d5af8ee597f263197d'; // Replace with your API key
    
    try {
      const response = await axios.get(`https://apis.mappls.com/advancedmaps/v1/${apiKey}/distance_matrix/driving/${origins};${destinations}`);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching distance matrix:', error);
      res.status(500).json({ error: 'An error occurred while fetching distance matrix' });
    }
  });
  
  // Still Image route
  router.get('/stillimage', async (req, res) => {
    // Extract required parameters from the query string
    const { center, zoom, size, markersIcon } = req.query;
    const apiKey = '1e8ff58f4c5cf1d5af8ee597f263197d'; // Replace with your API key
    
    try {
      const response = await axios.get(`https://apis.mappls.com/advancedmaps/v1/${apiKey}/still_image`, {
        params: {
          center,
          zoom,
          size,
          markers: center,
          markers_icon: markersIcon
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching still image:', error);
      res.status(500).json({ error: 'An error occurred while fetching still image' });
    }
  });
  
  module.exports = router;
  