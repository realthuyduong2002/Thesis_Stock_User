const express = require('express');
const router = express.Router();
const stockPriceController = require('../controllers/stockPriceController');

router.post('/stockprices', stockPriceController.createStockPrice);
router.get('/stockprices', stockPriceController.getStockPrices);
router.get('/stockprices/:id', stockPriceController.getStockPriceById);

module.exports = router;
