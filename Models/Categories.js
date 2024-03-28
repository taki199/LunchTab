const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    
  },

  image: {
    type: String,
    required: true,
  },
  IsDeleted: {
    type: Boolean,
    default: false,
  },
});

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports = Categories;
