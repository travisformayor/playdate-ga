const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/project1';

mongoose.connect(DB_URL, {useNewUrlParser: true, useFindAndModify: false})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

module.exports = {
  Pet: require('./pet'),
  Match: require('./match'),
  Chat: require('./chat')
};
