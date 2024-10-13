import React, { useState } from 'react';

function UserOrder() {
    const [foodName, setFoodName] = useState('');
    const [userName, setUserName] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [error, setError] = useState(null);
    
    // Sample food items
    const foodItems = [
        { name: 'Pizza', prepTime: 15 },
        { name: 'Burger', prepTime: 10 },
        { name: 'Pasta', prepTime: 20 },
        { name: 'Salad', prepTime: 5 },
        { name: 'Sushi', prepTime: 25 },
        { name: 'Tacos', prepTime: 12 },
        { name: 'Noodles', prepTime: 30 },
        { name: 'Ice Cream', prepTime: 5 },
        { name: 'Fried Rice', prepTime: 10 },
        { name: 'Sandwich', prepTime: 8 },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const orderDetails = {
            foodName,
            userName,
            userAddress,
            time: new Date().toISOString(),
        };

        fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails),
        })
            .then((response) => response.json())
            .then(() => {
                alert('Order placed successfully!');
                setFoodName('');
                setUserName('');
                setUserAddress('');
                setError(null);
            })
            .catch((error) => {
                setError(error.message);
                console.error('Error placing order:', error);
            });
    };

    return (
        <div>
            <h1>Place Your Order</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Your Name:
                        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Your Address:
                        <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Select Food Item:
                        <select value={foodName} onChange={(e) => setFoodName(e.target.value)} required>
                            <option value="">--Select--</option>
                            {foodItems.map((item) => (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit">Confirm Order</button>
            </form>
        </div>
    );
}

export default UserOrder;
