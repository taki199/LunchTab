const Dish = require('../Models/Dishes'); // Importing the Dish model

module.exports = {
  // Controller function to get all dishes with pagination
  getAllDishes: async (req, res) => {
    try {
      // Define pagination parameters
      const perPage = 5;
      const page = parseInt(req.query.page) || 1;

      // Fetch dishes, sorted by creation date in descending order
      const data = await Dish.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: perPage * (page - 1) }, // Skip dishes based on the current page
        { $limit: perPage } // Limit the number of dishes per page
      ]);

      // Count total number of dishes
      const count = await Dish.countDocuments({});

      // Calculate pagination information
      const nextPage = page + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);

      // Send paginated dishes data along with pagination info in the response
      res.send({
        data,
        pagination: {
          current: page,
          nextPage: hasNextPage ? nextPage : null
        }
      });
    } catch (error) {
      console.error('Error fetching dishes:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  // Controller function to find a dish by its ID
  findById: async (req, res) => {
    const id = req.params.id;
    try {
      const dish = await Dish.findById(id);
      if (!dish) {
        return res.status(404).json({ message: 'No dish found' });
      } else {
        return res.send(dish);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  // Controller function to create a new dish
  createDish: async (req, res) => {
    try {
      // Destructure request body to extract dish data
      const {
        name,
        description,
        price,
        category,
        image,
        stock,
        tags,
        ingredients,
        ratings,
        availabilitySchedule,
        specialOffers,
        relatedDishes
      } = req.body;

      // Create a new dish object
      const newDish = new Dish({
        name,
        description,
        price,
        category,
        image,
        stock,
        tags,
        ingredients,
        ratings,
        availabilitySchedule,
        specialOffers,
        relatedDishes
      });

      // Save the new dish to the database
      await newDish.save();

      res.status(201).json({ message: 'Dish created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create dish' });
    }
  },
  // Controller function to update an existing dish
  updateDish: async function (req, res) {
    try {
      // Get the id from the request parameter
      const id = req.params.id;
      const updatedDish = req.body;

      // Look for the dish with the given id in the database
      const dish = await Dish.findById(id);
      if (!dish) {
        return res.status(404).json({ message: 'The dish with the provided ID was not found.' });
      } else {
        // Update the dish object with the new data
        Object.assign(dish, updatedDish);
        // Save the updated dish to the database
        await dish.save();
        return res.status(200).json({ message: 'The dish was successfully updated.' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  // Controller function to delete an existing dish
  deleteDish: async function (req, res) {
    try {
      // Find and remove the dish with the given id from the database
      const id = req.params.id;
      if (!id) {
        return res.status(404).json({ message: 'No dish with this id exists!' });
      } else {
        await Dish.findByIdAndDelete(id);
        return res.status(200).json({ message: "Successfully deleted!" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
