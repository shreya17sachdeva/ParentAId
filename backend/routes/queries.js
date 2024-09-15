const express = require('express')
const {
    createQuery,
    getQueries,
    getQuery,
    deleteQuery,
    updateQuery,
    fetchAnswer 
} = require('../controllers/queryController')

//require auth for all query routes
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

//logging middleware
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

//get all queries
router.get('/', getQueries)

//get a single query
router.get('/:id', getQuery)

//post a new query
router.post('/', createQuery)

// Fetch answer from external API
router.post('/fetchAnswer', (req, res, next) => {
    console.log('fetchAnswer route accessed');
    fetchAnswer(req, res).catch(next);
});

//delete a query
router.delete('/:id', deleteQuery)

//update a query
router.patch('/:id', updateQuery)

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

module.exports = router