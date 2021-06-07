const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const Photo = require('./models/Photo.js');
const app = express();
const methodOverride = require('method-override');
const { METHODS } = require('http');

//connect DB
mongoose.connect('mongodb://localhost/pcat-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middelware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

//Templet Engine
app.set('view engine', 'ejs');

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
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

// to save our new image information to iur DATABase
app.get('/photos/:id', async (req, res) => {
  // console.log(req.params.id);
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
});

//delete photo
app.delete('/photos/:id', async (req, res) => {
  // find the current photo and delete it frpm uploads folder
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public/' + photo.image;
  fs.unlinkSync(deletedImage);

  // delete its database
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

// Get Data from add page
app.post('/photos', async (req, res) => {
  // The name of the input field ("uploadedIamge") is used to retrieve the uploaded file
  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  // if there is no uploads folder, create one :)
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Use the mv() method to place the file somewhere on your server
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create(
      {
        ...req.body,
        image: '/uploads/' + uploadedImage.name,
      },
      res.redirect('/')
    );
  });
});

//connection
const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
