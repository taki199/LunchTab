const { OrderedBulkOperation } = require('mongodb');
const Dish = require('../Models/Dishes')
const Order = require('../Models/Order')
module.exports = {
    getAllOrders: async (req, res) => {
        try {
            // Define pagination parameters
            const perPage = 5;
            const page = parseInt(req.query.page) || 1;

            // Fetch dishes, sorted by creation date in descending order
            const data = await Order.aggregate([
                { $sort: { createdAt: -1 } },
                { $skip: perPage * (page - 1) }, // Skip dishes based on the current page
                { $limit: perPage } // Limit the number of dishes per page
            ]);

            // Count total number of dishes
            const count = await Order.countDocuments({});

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
            console.error('Error fetching Orders:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    findOrderById: async (req, res) => {
        const id = req.params.id;
        try {
          const order = await Order.findById(id);
          if (!order) {
            return res.status(404).json({ message: 'No order was found' });
          } else {
            return res.send(order);
          }
        } catch (error) {
          return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
     createOrder : async (req, res) => {
        try {
            // Destructure request body to extract order data
            const { customerId, orderItems, orderStatus } = req.body;
    
            // Calculate the total amount
            let totalAmount = 0;
            for (const item of orderItems) {
                const dish = await Dish.findById(item.dishId);
    
                // Check if the quantity ordered exceeds the available stock
                if (dish.stock < item.quantity) {
                    return res.status(400).json({ message: `Not enough stock available for ${dish.name}` });
                }
    
                totalAmount += dish.price * item.quantity;
    
                // Decrement the stock of the dish based on the quantity ordered
                dish.stock -= item.quantity;
                await dish.save();
            }
    
            // Create a new order object with the calculated total amount
            const newOrder = new Order({
                customerId,
                orderItems,
                totalAmount, // Include the calculated total amount
                orderStatus
            });
    
            // Save the new order to the database
            await newOrder.save();
    
            // Manually populate the orderItems with dish details
            await Order.populate(newOrder, { path: 'orderItems.dishId', select: '_id name price' });
    
            res.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create Order' });
        }
    },
     updateOrder :async (req, res) => {
        try {
            const orderId = req.params.id; // Extract order ID from request parameters
            
            const { orderStatus } = req.body; // Extract updated order status or order items
    
            // Find the order by ID
            const order = await Order.findById(orderId);
    
            // If order is not found, return a 404 Not Found response
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
    
            // Update the order status if provided
            if (orderStatus) {
                order.orderStatus = orderStatus;
            }
    
            
    
            // Save the updated order to the database
            await order.save();
    
            res.status(200).json({ message: 'Order updated successfully', order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to update order' });
        }
    },
    deleteOrder: async (req, res) => {
        const orderId = req.params.id;
        try {
            if(!orderId){
                return res.status(400).json( "No valid order ID provided")
            }else{
                await Order.findByIdAndDelete(orderId);
                return res.status(200).json("Deleted Successfully");
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
            
        }
        
    }
    
    
    
    
    
    
};

