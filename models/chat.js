const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  messages: [{
    senderId: String,
    time: {
      type: Date,
      default: Date.now
    },
    content: String
  }]
})

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
