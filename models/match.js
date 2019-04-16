const mongoose = require('mongoose');
const Chat = require('./chat');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  match: [String],
  chatId: Chat.schema
});

const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
