const mongoose=require('mongoose');
const user=require('./user');

const repmessageSchema=mongoose.Schema({
    orderID:{
        type:'string',
        required:true
    },
    price:{
        type:'number',
        required:true
    },
    
    
});

module.exports=mongoose.model('repmessage',repmessageSchema);