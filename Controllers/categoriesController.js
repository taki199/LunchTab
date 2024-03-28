const Categories = require('../Models/Categories')

// Create a new category
const createCategory = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body
    const category = new Categories(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    // Find categories where IsDeleted is false
    const categories = await Categories.find({ IsDeleted: false });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    // Check if the category exists and is not soft deleted
    const category = await Categories.findOne({ _id: req.params.id, IsDeleted: false });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    // Return the category
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error retrieving category by ID:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    // Check if the category exists and is not soft deleted
    const category = await Categories.findOne({ _id: req.params.id, IsDeleted: false });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Update the category
    const updatedCategory = await Categories.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() }, // Include updatedAt field and other fields from req.body
      { new: true, runValidators: true }
    );

    // Return the updated category
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await Categories.findByIdAndUpdate(req.params.id, { IsDeleted: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
