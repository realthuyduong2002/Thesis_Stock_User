const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  stock_id: { type: Schema.Types.ObjectId, ref: 'Stock' },
  title: String,
  content: String,
  published_date: String,
});

module.exports = mongoose.model('News', newsSchema);