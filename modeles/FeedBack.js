const mongoose = require('mongoose');

const feedBack = new mongoose.Schema({
  apartementId: {type:mongoose.Schema.Types.ObjectId, required:true},
  user:String,
  content: String,
  
});