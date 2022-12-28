const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/user-routes')
const app = express();
const cookieParser = require('cookie-parser')
var port = 3000;

app.use(cookieParser())
app.use(express.json())
app.use('/api',routes);


mongoose.connect('mongodb+srv://sample1:ULL5FQPKcrCySZiP@cluster0.gmroxmc.mongodb.net/Login?retryWrites=true&w=majority').then(()=>{
    app.listen(port);
    console.log(`server is running at port ${port}`);
}).catch((err)=>{console.log(err)})


// ULL5FQPKcrCySZiP