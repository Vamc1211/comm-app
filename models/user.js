// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['Manufacturer', 'Transporter']},
  address: { type: String },
});

module.exports = mongoose.model('myUser', userSchema);
