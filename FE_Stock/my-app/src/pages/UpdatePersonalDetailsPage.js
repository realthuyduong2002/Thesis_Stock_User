// UpdatePersonalDetailsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../pages/UpdatePersonalDetailsPage.module.css';

const UpdatePersonalDetailsPage = () => {
    const { id } = useParams(); // Lấy `id` từ URL
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        preferredName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        country: ''
    });
    const [countryCode, setCountryCode] = useState(''); // Để lưu mã vùng của quốc gia
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState([]);

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

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const countryList = response.data.map(country => ({
                    name: country.name.common,
                    code: country.cca2,
                    callingCode: country.idd?.root + (country.idd?.suffixes ? country.idd.suffixes[0] : ''),
                }));
                // Sắp xếp danh sách quốc gia theo thứ tự bảng chữ cái
                countryList.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryList);
            })
            .catch(error => {
                console.error('Error fetching countries data:', error);
                setError('Failed to load country list');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'country') {
            // Tìm mã vùng cho quốc gia đã chọn
            const selectedCountry = countries.find(country => country.name === value);
            setCountryCode(selectedCountry ? selectedCountry.callingCode : '');
            setUserData({ ...userData, country: value });
        } else if (name === 'phoneNumber') {
            // Xóa mã vùng khỏi số điện thoại khi người dùng thay đổi
            setUserData({ ...userData, phoneNumber: value.replace(countryCode, '') });
        } else {
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:4000/api/users/${id}`, userData)
            .then(() => {
                alert('Personal details updated successfully!');
                navigate(`/account/${id}`);
            })
            .catch(error => {
                console.error('Error updating user details:', error);
                setError('Failed to update personal details');
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.updatePage}>
            <h2>Update Personal Details</h2>
            <form onSubmit={handleSubmit} className={styles.updateForm}>
                <label>
                    First Name:
                    <input 
                        type="text" 
                        name="firstName" 
                        value={userData.firstName || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Last Name:
                    <input 
                        type="text" 
                        name="lastName" 
                        value={userData.lastName || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Preferred Name:
                    <input 
                        type="text" 
                        name="preferredName" 
                        value={userData.preferredName || ''} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Date of Birth:
                    <input 
                        type="date" 
                        name="dateOfBirth" 
                        value={userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : ''} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Gender:
                    <select 
                        name="gender" 
                        value={userData.gender || ''} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
                <label>
                    Phone Number:
                    <div className={styles.phoneNumberContainer}>
                        <span>{countryCode}</span>
                        <input 
                            type="tel" 
                            name="phoneNumber" 
                            value={userData.phoneNumber || ''} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter phone number"
                        />
                    </div>
                </label>
                <label>
                    Country:
                    <select 
                        name="country" 
                        value={userData.country || ''} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit" className={styles.submitButton}>Save Changes</button>
            </form>
        </div>
    );
};

export default UpdatePersonalDetailsPage;