// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080;
const cors = require('cors');
app.use(cors());
const path = require('path');

app.use(express.static(path.join(__dirname,'build')));

// Connect to MongoDB
mongoose.connect("mongodb+srv://root:system@node-api.hzzmxs6.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log("Connected to MongoDB"));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Models
const User = require('./models/user');
const reqMessage = require('./models/reqmessage');
const repMessage=require('./models/repmessage');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello anna!')
  })
  // app.get('/register', (req, res) => {
  //   res.sendFile(path.join(__dirname,'./assign','src/components','registration.js'));
  // })

  app.get('/', (req, res) => {
    res.send('Hello anna!')
  })


  // app.get('/manufacturer', (req, res) => {
  //   res.redirect("http://localhost:3000/manufacturer");
  // });
  

// Registration API
app.post('/api/register', (req, res) => {
  const { username, password, role, address } = req.body;
  const newUser = new User({ username, password, role, address });
  newUser.save()
    .then(() => {
      res.status(200).json({ message: 'Registration successful' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    });
});

// Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ password:password });
    res.send(user);
    // Handle the found user
    
    // if(user.role==='Manufacturer'){

    //   res.redirect('/manufacturer');}
    // else{
    //   res.redirect('/transporter');
    // }
  } catch (error) {
    // Handle any errors
    console.error(error);
  }
});

// Create Message API
app.post('/api/messages/:id', (req, res) => {
  const { sender,orderID, to, from, quantity, address, transporter } = req.body;
  const newMessage = new reqMessage({ sender,orderID, to, from, quantity, address, transporter });
  newMessage.save()
    .then(() => {
      res.status(200).json({ message: 'Message sent successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to send message' });
    });
});

// Get Messages API
app.get('/api/messages/:id', (req, res) => {
  console.log(req.query.id);
  reqMessage.find({transporter:req.query.id})
    .exec()
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch messages' });
    });
});

//post reply API

app.post('/api/reply',async (req,res)=>{
  const{orderID,price}=req.body;
  const newreply=await new repMessage({orderID:orderID,price:price});
  newreply.save()
  .then(()=>{
    res.status(200).json({message:'reply sent successfully'});
  })
  .catch(err=>{
    console.error(err);
  })

})
//get replies API
app.get('/api/reply',async (req,res)=>{
  try{
  const orderIDs=req.query.orderIDs.split(',');
  console.log(orderIDs);
  const replies=await repMessage.find({ orderID: { $in: orderIDs } });
  console.log(replies);
  res.send(replies);}
  catch(err){
    console.error(err);
  }
})
//returning list of orders

app.get('/api/orders',async (req,res)=>{
  try{
    console.log(req.query.id);
    console.log('hugh');
    const orders=await reqMessage.find({sender:req.query.id});
    res.send(orders);

  }
  catch(err){
    console.error(err);
  }
})
//returning list of transporters

app.get('/alltrans',async (req,res)=>{
  try{
  const alltrans=await User.find({role:'Transporter'});
  res.send(alltrans);}
  catch(err){
    console.error(err);
  }
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'build','index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
