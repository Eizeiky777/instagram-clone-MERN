const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./config/keys');

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', () => {
    console.log('mongoo yeahh')
})
mongoose.connection.on('error', (err) => {
    console.log('error monggo', err) 
})

// Schema
require('./models/user');
require('./models/post');  

// parse into json firstly
app.use(express.json());
// routes 
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV === "production"){
    app.use(express.static('instagram/build'))
    const path = require('path')
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname,'instagram','build','index.html'))
    })
}

app.listen(PORT, () => {
    console.log("server is running on ", PORT)
})