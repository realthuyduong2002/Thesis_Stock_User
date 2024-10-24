const Stock = require('../models/Stock');

exports.createStock = async (req, res) => {
  const stock = new Stock(req.body);
  await stock.save();
  res.status(201).send(stock);
};

exports.getStocks = async (req, res) => {
  const stocks = await Stock.find();
  res.status(200).send(stocks);
};

exports.getStockById = async (req, res) => {
  const stock = await Stock.findById(req.params.id);
  res.status(200).send(stock);
};