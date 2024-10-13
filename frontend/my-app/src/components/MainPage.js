import React, { useEffect, useState } from 'react';
import './App.css'; // Make sure this imports your styles

const MainPage = () => {
    const [foodItems, setFoodItems] = useState([]);

    useEffect(() => {
        // Fetch food items from the backend
        fetch('http://localhost:5001/api/food-items')
            .then((response) => response.json())
            .then((data) => setFoodItems(data))
            .catch((error) => console.error('Error fetching food items:', error));
    }, []);

    const handleOrder = (foodName) => {
        const confirmOrder = window.confirm(`Do you want to confirm your order of ${foodName}?`);
        if (confirmOrder) {
            const order = {
                foodName: foodName,
                // Add more details if needed, like user details
                time: new Date().toISOString(), // Use current time as order time
            };

            // Send a POST request to place the order
            fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(() => {
                    console.log(`Order confirmed for: ${foodName}`);
                    // Optionally, you can show a success message
                    alert(`Order placed for: ${foodName}`);
                })
                .catch((error) => console.error('Error placing order:', error));
        }
    };

    return (
        <div className="main-container">
            <h1 className="title">Food Menu</h1>
            <div className="food-list">
                {foodItems.map((item) => (
                    <div key={item.id} className="food-item">
                        <img src={item.image} alt={item.name} />
                        <h2>{item.name}</h2>
                        <p>Price: {item.price}</p>
                        <p>Preparation Time: {item.prepTime} mins</p>
                        <button onClick={() => handleOrder(item.name)}>Book Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainPage;
