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
        const response = await axios.get(`https://apis.mappls.com/advancedmaps/v1/${apiKey}/distance_matrix_eta/driving/${origins};${destinations}`);
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
            },
            responseType: 'arraybuffer' // Set response type to arraybuffer to handle binary data
        });
        // Send the binary data directly as the response
        res.writeHead(200, {
            'Content-Type': 'image/png' // Set the content type to image/png
        });
        res.end(response.data, 'binary');
    } catch (error) {
        console.error('Error fetching still image:', error);
        res.status(500).json({ error: 'An error occurred while fetching still image' });
    }
});


// Geo-location route (POST)
router.post('/geo-location', async (req, res) => {
    const bearerToken = process.env.BEARER_TOKEN; // Load bearer token from environment variables
    
    try {
        const response = await axios.post(`https://atlas.mappls.com/api/places/geo-location`, req.body, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching geo-location:', error);
        res.status(500).json({ error: 'An error occurred while fetching geo-location' });
    }
});

// eLoc route (GET)
router.get('/eloc/:eLoc', async (req, res) => {
    const { eLoc } = req.params;
    const bearerToken = process.env.BEARER_TOKEN; // Load bearer token from environment variables
    
    try {
        const response = await axios.get(`https://explore.mappls.com/apis/O2O/entity/${eLoc}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching eLoc:', error);
        res.status(500).json({ error: 'An error occurred while fetching eLoc' });
    }
});

// Geocode route
router.get('/geocode', async (req, res) => {
    const { region, address, itemCount, bias, bound } = req.query;
    const bearerToken = process.env.BEARER_TOKEN; // Load bearer token from environment variables
    
    try {
        const response = await axios.get(`https://atlas.mappls.com/api/places/geocode?region=${region}&address=${address}&itemCount=${itemCount}&bias=${bias}&bound=${bound}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching geocode:', error);
        res.status(500).json({ error: 'An error occurred while fetching geocode' });
    }
});

// Text Search route
router.get('/textsearch', async (req, res) => {
    const { query, region, location, filter } = req.query;
    const bearerToken = process.env.BEARER_TOKEN; // Load bearer token from environment variables
    
    try {
        const response = await axios.get(`https://atlas.mappls.com/api/places/textsearch/json?query=${query}&region=${region}&location=${location}`, {
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



module.exports = router;
