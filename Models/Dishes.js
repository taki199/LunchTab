const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a Category document
    ref: 'Category', // Reference to the Category collection
    required: true
  },
  image: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  ingredients: {
    type: [String],
    default: []
  },
  ratings: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        rating: {
          type: Number,
          required: true
        },
        review: {
          type: String,
          required: true
        }
      }
    ],
    default: []
  },
  availabilitySchedule: {
    dayOfWeek: {
      type: [Number],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  specialOffers: [
    {
      offerType: {
        type: String,
        
      },
      offerDescription: {
        type: String,
       
      },
      discountAmount: {
        type: Number,
        
      }
    }
  ],
  relatedDishes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Dish',
    default: []
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model('Dish', dishSchema);
