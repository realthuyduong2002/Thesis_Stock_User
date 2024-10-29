import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './AccountPage.module.css';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';

const AccountPage = () => {
    const { id } = useParams(); // Get 'id' from URL
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError('No user ID provided.');
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:4000/api/users/${id}`)
            .then(response => {
                setUserData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    return (
        <div className={styles.accountPage}>
            <header className={styles.header}>
                <Link to="/">
                    <img src={logo} alt="Stock Insight Logo" className={styles.logo} />
                </Link>
                <div className={styles.searchContainer}>
                    <input type="text" placeholder="Search in accounts..." className={styles.searchBar} />
                    <i className="fas fa-search searchIcon"></i>
                </div>
                <div className={styles.profileIcon}>
                    <img src={avatar} alt="User Avatar" className={styles.avatar} />
                </div>
            </header>
            <nav className={styles.navbar}>
                <a href="#personal-info" className={styles.navLink}>Personal information</a>
                <a href="#security" className={styles.navLink}>Security</a>
                <a href="#recent-activity" className={styles.navLink}>Recent activity</a>
                <a href="#wallet" className={styles.navLink}>Wallet</a>
            </nav>
            <main className={styles.mainContent}>
                <section id="personal-info" className={styles.section}>
                    <h2>Personal Information</h2>
                    <div className={styles.infoContainer}>
                        <div className={styles.details}>
                            <h3>Your details</h3>
                            <p>First name: {userData.firstName || 'N/A'}</p>
                            <p>Last name: {userData.lastName || 'N/A'}</p>
                            <p>Preferred name: {userData.preferredName || 'N/A'}</p>
                            <p>Date of birth: {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                            <p>Gender: {userData.gender || 'N/A'}</p>
                            <p>Phone number: {userData.phoneNumber || 'N/A'}</p>
                            <p>Country: {userData.country || 'N/A'}</p>
                            <a href="/update-personal-details" className={styles.updateLink}>Update personal details</a>
                        </div>
                        <div className={styles.profileSettings}>
                            <div className={styles.userInfo}>
                                <img src={avatar} alt="User Avatar" className={styles.avatarLarge} />
                                <p>{userData.username}</p>
                                <p>{userData.email}</p>
                                <a href="/update-profile-avatar" className={styles.updateLink}>Update profile avatar</a>
                            </div>
                            <div className={styles.language}>
                                <h3>Language</h3>
                                <p>English - United Kingdom</p>
                                <a href="/update-language" className={styles.updateLink}>Update language</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AccountPage;