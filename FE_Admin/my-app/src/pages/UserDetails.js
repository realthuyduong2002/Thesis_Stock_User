import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import styles from '../pages/UserDetails.module.css';

const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

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
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles['user-details-page']}>
            <Sidebar />
            <div className={styles['user-details-container']}>
                <div className={styles['user-info-section']}>
                    <h2>User Information</h2>
                    <div className={styles['user-info']}>
                        <p><strong>user_id:</strong> {user._id}</p>
                        <p><strong>username:</strong> {user.username}</p>
                        <p><strong>email:</strong> {user.email}</p>
                        <p><strong>First name:</strong> {user.firstName}</p>
                        <p><strong>Last name:</strong> {user.lastName}</p>
                        <p><strong>Preferred name:</strong> {user.preferredName}</p>
                        <p><strong>Date of birth:</strong> {user.dob}</p>
                        <p><strong>Gender:</strong> {user.gender}</p>
                        <p><strong>Phone number:</strong> {user.phoneNumber}</p>
                        <p><strong>Country:</strong> {user.country}</p>
                    </div>
                    <div className={styles['status']}>
                        <p><strong>Status:</strong> <span className={`status ${user.status ? user.status.toLowerCase() : ''}`}>{user.status}</span></p>
                        <a href="/update-status">Update status</a>
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