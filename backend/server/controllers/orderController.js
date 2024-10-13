const fs = require('fs');
const path = require('path');
const ordersFilePath = path.join(__dirname, '../data/orders.json');

const foodItems = [
    { id: 1, name: 'Pizza', price: '$10', prepTime: 15, image: 'pizza.jpg' },
    { id: 2, name: 'Burger', price: '$8', prepTime: 10, image: 'burger.jpeg' },
    { id: 3, name: 'Pasta', price: '$12', prepTime: 20, image: 'pasta.jpeg' },
    { id: 4, name: 'Salad', price: '$7', prepTime: 5, image: 'salad.jpeg' },
    { id: 5, name: 'Sushi', price: '$15', prepTime: 25, image: 'sushi.jpeg' },
    { id: 6, name: 'Tacos', price: '$9', prepTime: 12, image: 'tacos.jpeg' },
    { id: 7, name: 'Noodles', price: '$20', prepTime: 30, image: 'noodles.jpeg' },
    { id: 8, name: 'Ice Cream', price: '$5', prepTime: 5, image: 'icecream.jpeg' },
    { id: 9, name: 'Fried Rice', price: '$4', prepTime: 10, image: 'fried_rice.jpeg' },
    { id: 10, name: 'Sandwich', price: '$3', prepTime: 8, image: 'sandwich.jpeg' },
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
