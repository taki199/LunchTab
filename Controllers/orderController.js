const { OrderedBulkOperation } = require('mongodb');
const Dish = require('../Models/Dishes')
const Order = require('../Models/Order')
module.exports = {
    getAllOrders: async (req, res) => {
        try {
            // Define pagination parameters
            const perPage = 5;
            const page = parseInt(req.query.page) || 1;

            // Fetch orders where IsDeleted is false, sorted by creation date in descending order
            const data = await Order.aggregate([
                { $match: { IsDeleted: false } }, // Only fetch orders that are not soft deleted
                { $sort: { createdAt: -1 } },
                { $skip: perPage * (page - 1) }, // Skip orders based on the current page
                { $limit: perPage } // Limit the number of orders per page
            ]);

            // Count total number of orders that are not soft deleted
            const count = await Order.countDocuments({ IsDeleted: false });

            // Calculate pagination information
            const nextPage = page + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);

            // Send paginated orders data along with pagination info in the response
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
            // Find the order by ID
            const order = await Order.findById(id);

            // If order is not found, return a 404 Not Found response
            if (!order) {
                return res.status(404).json({ message: 'No order was found' });
            }

            // Check if the order is soft deleted
            if (order.IsDeleted) {
                return res.status(404).json({ message: 'Order has already been deleted' });
            }

            // If the order is found and not soft deleted, send it in the response
            return res.send(order);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    createOrder: async (req, res) => {
        try {
            // Destructure request body to extract order data
            const { customerId, orderItems, orderStatus } = req.body;

            // Calculate the total amount
            let totalAmount = 0;
            for (const item of orderItems) {
                if (!item || typeof item !== 'object' || !('dishId' in item) || !('quantity' in item)) {
                    return res.status(400).json({ message: 'Invalid order item' });
                }

                const dish = await Dish.findById(item.dishId);
                if (!dish) {
                    return res.status(400).json({ message: 'Dish not found' });
                }

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
    updateOrder: async (req, res) => {
        try {
            const orderId = req.params.id; // Extract order ID from request parameters
            const { orderStatus } = req.body; // Extract updated order status or order items

            // Find the order by ID
            const order = await Order.findById(orderId);

            // If order is not found, return a 404 Not Found response
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order is soft deleted
            if (order.IsDeleted) {
                return res.status(404).json({ message: 'Order has already been deleted' });
            }

            // Update the order status if provided
            if (orderStatus) {
                order.orderStatus = orderStatus;
            }

            // Save the updated order to the database
            const updatedOrder = await order.save();

            res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to update order' });
        }
    },
    deleteOrder: async (req, res) => {
        const orderId = req.params.id;
        try {
            if (!orderId) {
                return res.status(400).json("No valid order ID provided");
            } else {
                // Find the order by ID and update the IsDeleted field to true
                const order = await Order.findByIdAndUpdate(orderId, { IsDeleted: true });
                if (!order) {
                    return res.status(404).json("Order not found");
                }
                return res.status(200).json(" deleted successfully");
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    },
    getOrdersByUser : async (req, res) => {
        try {
          // Extract user ID from the token
          const userId = req.userId; // Assuming userId is the field containing the user ID in the decoded token
          console.log(userId);
      
          // Query orders belonging to the user
          const orders = await Order.find({ customerId: userId });
      
          res.status(200).json({ success: true, data: orders });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Failed to fetch orders' });
        }
      }
      






};

