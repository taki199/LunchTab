const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports = Categories;
