// models/message.js

const mongoose = require('mongoose');
const user=require('./user');

const reqmessageSchema = new mongoose.Schema(
    {
      sender:{type:mongoose.Schema.Types.ObjectId,ref:user,required:true},
  orderID: { type: String, required: true },
  to: { type: String, required: true },
  from: { type: String, required: true },
  quantity:{type: Number, required: true},
  address:{type:'string' ,required: true},
  transporter:{type: mongoose.Schema.Types.ObjectId,
    ref: user,
    required:true}


    });

module.exports=mongoose.model('reqmessage',reqmessageSchema);
