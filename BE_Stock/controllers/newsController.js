const News = require('../models/News');

exports.createNews = async (req, res) => {
  const news = new News(req.body);
  await news.save();
  res.status(201).send(news);
};

exports.getNews = async (req, res) => {
  const news = await News.find().populate('stock_id');
  res.status(200).send(news);
};

exports.getNewsById = async (req, res) => {
  const news = await News.findById(req.params.id).populate('stock_id');
  res.status(200).send(news);
};
