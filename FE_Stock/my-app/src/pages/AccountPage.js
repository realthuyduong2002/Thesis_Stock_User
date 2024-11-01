import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styles from './AccountPage.module.css';
import logo from '../assets/logo.png';
import defaultAvatar from '../assets/avatar.png';

const AccountPage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatarTimestamp, setAvatarTimestamp] = useState(new Date().getTime());
    const [countryCode, setCountryCode] = useState('');

    const fetchUserData = () => {
        if (!id) {
            setError('No user ID provided.');
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:4000/api/users/${id}`)
            .then(response => {
                setUserData(response.data);
                setLoading(false);

                // Get area codes based on country
                if (response.data.country) {
                    fetchCountryCode(response.data.country);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data');
                setLoading(false);
            });
    };

    const fetchCountryCode = (countryName) => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const country = response.data.find(c => c.name.common === countryName);
                if (country && country.idd) {
                    setCountryCode(country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''));
                }
            })
            .catch(error => {
                console.error('Error fetching country code:', error);
            });
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    useEffect(() => {
        if (userData?.avatar) {
            setAvatarTimestamp(new Date().getTime());
        }
    }, [userData?.avatar]);

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
                    <span className={styles.searchIcon}><i className="fas fa-search"></i></span>
                </div>
                <div className={styles.profileIcon}>
                    <img src={`${userData.avatar || defaultAvatar}?timestamp=${avatarTimestamp}`} alt="User Avatar" className={styles.avatar} />
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
                            <p>
                                Phone number: {countryCode ? `${countryCode} ${userData.phoneNumber}` : userData.phoneNumber || 'N/A'}
                            </p>
                            <p>Country: {userData.country || 'N/A'}</p>
                            <Link to={`/update-personal-details/${id}`} className={styles.updateLink}>Update personal details</Link>
                        </div>
                        <div className={styles.profileSettings}>
                            <div className={styles.userInfo}>
                                <img src={`${userData.avatar || defaultAvatar}?timestamp=${avatarTimestamp}`} alt="User Avatar" className={styles.avatarLarge} />
                                <p className={styles.username}>{userData.username}</p> {/* Thêm class để in đậm */}
                                <p>{userData.email}</p>
                                <Link to={`/account/${id}/update-avatar`} className={styles.updateLink}>Update profile avatar</Link>
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