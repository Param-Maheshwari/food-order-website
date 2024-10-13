import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './AdminPortal.css';

function AdminPortal() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null); // State to track errors

    // Memoize foodItems so it's stable and doesn't change between renders
    const foodItems = useMemo(() => [
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
    ], []); // Empty dependency array ensures it's only created once

    // Fetch orders with useCallback
    const fetchOrders = useCallback(() => {
        fetch('http://localhost:5000/api/orders')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const completedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
            
                // Enriching orders with food prep time and user details
                const enrichedOrders = data.map((order) => {
                    const foodItem = foodItems.find(item => item.name === order.foodName);
                    return {
                        ...order,
                        prepTime: foodItem ? foodItem.prepTime : 0,
                        userName: order.userName || 'Unknown', // Should reflect the user's name or fallback to 'Unknown'
                    };
                }).filter(order => !completedOrders.includes(order.id));
            
                // Sort orders by prep time and id (SJF, then FCFS)
                const sortedOrders = enrichedOrders.sort((a, b) => {
                    if (a.prepTime === b.prepTime) {
                        return a.id - b.id; // FCFS: if prep times are the same, compare by id
                    }
                    return a.prepTime - b.prepTime; // SJF: shortest job first
                });
            
                setOrders(sortedOrders);
                setError(null); // Clear previous errors
            })
            
            
            .catch((error) => {
                setError(error.message); // Set error message for UI
                console.error('Error fetching orders:', error);
            });
    }, [foodItems]); // Include foodItems as a dependency to avoid warnings

    // Mark order as complete by removing it from the list
    const completeOrder = (id) => {
        fetch(`http://localhost:5000/api/orders/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                const updatedOrders = orders.filter((order) => order.id !== id);
                setOrders(updatedOrders);

                const completedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
                completedOrders.push(id);
                localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
            })
            .catch((error) => {
                setError(error.message); // Handle error during order completion
                console.error('Error completing order:', error);
            });
    };

    // Fetch orders initially and set up polling every 5 seconds
    useEffect(() => {
        fetchOrders();
        const intervalId = setInterval(fetchOrders, 5000);

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [fetchOrders]);

    return (
        <div className="admin-container">
            <h1>Admin Portal</h1>
            <h2>Current Orders</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Display error message */}
            {orders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Prep Time (mins)</th>
                            <th>Ordered By</th>
                            <th>Ordered At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.foodName}</td>
                                <td>{order.prepTime}</td>
                                <td>{order.userName}</td>
                                <td>{order.time ? new Date(order.time).toLocaleString() : 'N/A'}</td>
                                <td>
                                    <button onClick={() => completeOrder(order.id)}>
                                        Complete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders have been placed yet.</p>
            )}
        </div>
    );
}

export default AdminPortal;
