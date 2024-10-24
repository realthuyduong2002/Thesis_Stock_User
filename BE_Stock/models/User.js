const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  role: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);