const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo.js');
const app = express();

//connect DB
mongoose.connect('mongodb://localhost/pcat-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Templet Engine
app.set('view engine', 'ejs');

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', {
    photos,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/photo', (req, res) => {
  res.render('photo');
});

// to save our new image information to iur DATABase
app.post('/photos', async (req, res) => {
  // our new photo information
  await Photo.create(req.body);

  // to go back to home page after submit
  res.redirect('/');
});

// Middelware
app.use(express.static('public'));
const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
