const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cacheTest' , { useUnifiedTopology : true , useNewUrlParser : true});

app.use(bodyParser.json());

const blogRouter = require('./routes/blogs');
app.use(blogRouter);


module.exports = startApp = () =>  {
    app.listen(3000 , console.log('app is running on 3000'));
}