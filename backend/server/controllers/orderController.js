const fs = require('fs');
const path = require('path');
const ordersFilePath = path.join(__dirname, '../data/orders.json');

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

// Helper function to read orders from the JSON file
const getOrdersFromFile = () => {
    if (!fs.existsSync(ordersFilePath)) {
        return [];
    }
    const data = fs.readFileSync(ordersFilePath);
    return JSON.parse(data);
};

// Helper function to save orders to the JSON file
const saveOrdersToFile = (orders) => {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
};

// Create a new order
const createOrder = (req, res) => {
    const { foodName, prepTime } = req.body;
    const orders = getOrdersFromFile();
    const newOrder = {
        id: orders.length + 1,
        foodName,
        prepTime,
        time: new Date().toISOString(),
    };
    orders.push(newOrder);
    saveOrdersToFile(orders);
    res.status(201).json(newOrder);
};

// Get all orders
const getOrders = (req, res) => {
    const orders = getOrdersFromFile();
    res.json(orders);
};

module.exports = {
    createOrder,
    getOrders,
};
