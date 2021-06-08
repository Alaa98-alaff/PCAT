const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPerPage = 2;
  const totalPhotos = await Photo.find().countDocuments();

  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
};

exports.createPhoto = async (req, res) => {
  // The name of the input field ("uploadedIamge") is used to retrieve the uploaded file
  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

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
};

exports.deletePhoto = async (req, res) => {
  // find the current photo and delete it frpm uploads folder
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public/' + photo.image;
  fs.unlinkSync(deletedImage);
  // delete its database
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
