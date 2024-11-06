import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/DashboardCard.css';

const DashboardCard = () => {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const fetchUserCount = async () => {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            try {
                const response = await axios.get('http://localhost:4000/api/users/count', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('User count response:', response.data); // Debugging: check response data
                setUserCount(response.data.count); // Update state with the count
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };

        fetchUserCount();
    }, []); // The empty dependency array ensures this runs once when the component mounts

    return (
        <div className="dashboard-cards">
            <div className="card">
                <span className="card-title">Users</span>
                <strong>{userCount}</strong> {/* Display the actual user count */}
            </div>
            <div className="card">
                <span className="card-title">Stocks</span>
                <strong>1,000</strong> {/* Update this with actual data if needed */}
            </div>
            <div className="card">
                <span className="card-title">Transactions</span>
                <strong>1,000</strong> {/* Update this with actual data if needed */}
            </div>
        </div>
    );
};

export default DashboardCard;
