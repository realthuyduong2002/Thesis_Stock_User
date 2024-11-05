// src/pages/UserDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import styles from '../pages/UserDetails.module.css';

const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError('Error fetching user details');
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (loading) {
        return (
            <div className={styles['user-details-page']}>
                <Header />
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles['user-details-page']}>
                <Header />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles['user-details-page']}>
            <Header />
            <div className={styles['user-details-container']}>
                <div className={styles['user-info-section']}>
                    <h2>User Information</h2>
                    <div className={styles['user-info']}>
                        <p><strong>User ID:</strong> {user._id}</p>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Preferred Name:</strong> {user.preferredName}</p>
                        <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                        <p><strong>Gender:</strong> {user.gender}</p>
                        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                        <p><strong>Country:</strong> {user.country}</p>
                    </div>
                    <div className={styles['status-section']}>
                        <p>
                            <strong>Status:</strong> 
                            <span className={`status ${user.status ? user.status.toLowerCase() : ''}`}>
                                {user.status}
                            </span>
                        </p>
                        <Link to="/update-status">Update Status</Link>
                    </div>
                </div>
                <div className={styles['avatar-section']}>
                    <img src={user.avatar || '/default-avatar.png'} alt="User Avatar" className={styles['avatar']} />
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
