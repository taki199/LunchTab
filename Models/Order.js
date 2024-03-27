const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    orderItems: [{
        dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number, // Store the total amount directly in the database
        required: true,
        default:0
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
