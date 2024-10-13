const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// File path for orders.json
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

// Initialize orders array
let orders = [];

// Load existing orders from JSON file
if (fs.existsSync(ordersFilePath)) {
    const data = fs.readFileSync(ordersFilePath);
    orders = JSON.parse(data);
}

// Food items (define your food items here with image properties)
const foodItems = [
    { id: 1, name: 'Pizza', price: '250 Rs', prepTime: 15, image: '/images/pizza.png' },
    { id: 2, name: 'Burger', price: '100 Rs', prepTime: 10, image: '/images/burger.png' },
    { id: 3, name: 'Pasta', price: '120 Rs', prepTime: 20, image: '/images/pasta.png' },
    { id: 4, name: 'Salad', price: '50 Rs', prepTime: 5, image: '/images/salad.png' },
    { id: 5, name: 'Sushi', price: '120 Rs', prepTime: 25, image: '/images/sushi.png' },
    { id: 6, name: 'Tacos', price: '110 Rs', prepTime: 12, image: '/images/tacos.png' },
    { id: 7, name: 'Noodles', price: '140 Rs', prepTime: 30, image: '/images/noodles.png' },
    { id: 8, name: 'Ice Cream', price: '40 Rs', prepTime: 5, image: '/images/icecream.png' },
    { id: 9, name: 'Fried Rice', price: '90 Rs', prepTime: 10, image: '/images/friedrice.png' },
    { id: 10, name: 'Sandwich', price: '45 Rs', prepTime: 8, image: '/images/sandwich.png' },
];

// API to get food items
app.get('/api/food-items', (req, res) => {
    res.json(foodItems);
});

// Initialize SSE clients array
let clients = [];

// SSE endpoint for streaming orders
app.get('/api/orders/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add client to the clients array
    clients.push(res);

    // Remove the client from the array when connection closes
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

// Function to notify all clients of a new order
const notifyClients = (order) => {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(order)}\n\n`);
    });
};

// API to place an order
app.post('/api/orders', (req, res) => {
    const { foodId, userName } = req.body; // Get foodId and userName from the request body
    const foodItem = foodItems.find(item => item.id === foodId); // Find the food item

    if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
    }

    // Create a new order with userName included
    const newOrder = {
        id: generateOrderId(),
        foodName,
        userName, // Ensure userName is stored
        time,
    };

    orders.push(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    
    // Notify clients about the new order
    notifyClients(newOrder);
    
    res.status(201).json(newOrder);
});


// API to get orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// DELETE endpoint for removing an order
app.delete('/api/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id, 10); // Get order ID from URL
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1); // Remove the order from the array
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2)); // Update the JSON file
        res.status(204).send(); // Send back a 204 No Content response
    } else {
        res.status(404).send({ message: 'Order not found' }); // Handle not found case
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Food Order API!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
