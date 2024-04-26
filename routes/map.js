const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// Text Search route
router.get('/textsearch', async (req, res) => {
    const { query, itemCount } = req.query;
    const bearerToken = process.env.BEARER_TOKEN; // Load bearer token from environment variables
    
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
    const apiKey = process.env.API_KEY; // Load API key from environment variables
    
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
    const apiKey = process.env.API_KEY; // Load API key from environment variables
    
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
