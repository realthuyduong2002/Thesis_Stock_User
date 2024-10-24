const User = require('../models/User');

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).send(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
};
