const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const mongoose = require('mongoose');
const dbConfig = require('./config/database.config');
const mongoDB = mongoose.connect(dbConfig.url)
    .then(() => {
        console.log('Successfully Connected..');
    }).catch(err => {
        console.log('Could Not connected to the database.');
        process.exit();
    });


// schema, using mongoose
const membership = mongoose.Schema({
    username: String,
    password: String,
    gender: String
}, {
        timestemps: true
    });

const memberModel = mongoose.model('MEM', membership, 'membership');

app.post('/register', (req, res) => {
    var ctr = new memberModel(req.body);
    ctr.save((err, data) => {
        if (err) {
            res.send('Not Save');
        } else {
            res.send("save");
        }
    });
});

app.post('/login', (req, res) => {
    let userdata = req.body;
    memberModel.findOne({ username: userdata.username }, (err, tem) => {
        if (err) {
            console.log("Login Failed");
        } else {
            if (!tem) {
                res.send('Wrong User Name');
            } else {
                if (tem.password != userdata.password) {
                    res.send('Wrong Password');
                } else {
                    res.send('Login Successfully.');
                }
            }
        }
    });
});

app.get('/fatchUser', (req,res) => {
    let userdata = req.body;
    memberModel.find((err, tem) => {
        if(err){
            console.log('No Users Found');
        }else{
            res.json(tem);
        }
    });
});

app.get('/', (req, res) => {
    res.json({ 'Message': 'Testing is success' });
});

app.listen('5000', () => {
    console.log("Server Start..");
});