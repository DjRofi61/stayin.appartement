const mongoose = require('mongoose');

const feedBackShema = new mongoose.Schema({
  id: {type: mongoose.Schema.Types.ObjectId},
  user:String,
  feedBack: String,
  
});

const FeedBack = mongoose.model('feedBack', feedBackShema);

module.exports = FeedBack;