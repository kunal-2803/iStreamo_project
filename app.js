require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');


const profileRoutes = require('./routes/profileRoute');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const exploreRoutes = require('./routes/exploreRoute');
const cookieParser = require('cookie-parser');

require("./db");

const app = express();
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.send("Hello World")});
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/posts', postRoutes);
app.use('/explore', exploreRoutes);


const port = process.env.PORT; 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
