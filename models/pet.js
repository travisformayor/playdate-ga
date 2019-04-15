const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
  loginId: Number,
  name: String,
  type: String,
  age: Number,
  bio: String,
  img: String,
  likes: [String]
})

const Pet = mongoose.model('Pet', PetSchema);
module.exports = Pet;
