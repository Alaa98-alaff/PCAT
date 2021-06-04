const mongoose = require('mongoose');
const mongodb = require('mongodb');
const Schema = mongoose.Schema;
const ObjectID = mongodb.ObjectID;

mongoose.connect('mongodb://localhost:27017/pcat-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//creat schema
const PhotoShema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model('Photo', PhotoShema);

// Photo.create({
//   title: 'photo title 2',
//   description: 'photo description 2',
// });

// Read data
Photo.findById('60b916f86a64c14f94d52de3', (error, data) => console.log(data));
Photo.find({}, (error, data) => console.log(data));

//update data
const id = '60b916f86a64c14f94d52de3';
Photo.findByIdAndUpdate(
  id,
  {
    title: 'update2',
    description: 'updated2',
  },
  {
    new: true,
  },
  (error, data) => console.log(data)
);

// Delete data
Photo.findByIdAndDelete(id, (error, data) => console.log('Photo deleted'));
