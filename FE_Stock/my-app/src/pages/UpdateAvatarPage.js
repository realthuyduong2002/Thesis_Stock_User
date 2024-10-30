import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../pages/UpdateAvatarPage.module.css';

const UpdateAvatarPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [avatarFile, setAvatarFile] = useState(null);
    const [error, setError] = useState(null);

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (!avatarFile) {
                setError("Please select an avatar to upload.");
                return;
            }
    
            const formData = new FormData();
            formData.append('avatar', avatarFile);
    
            await axios.post(`http://localhost:4000/api/users/${id}/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token nếu cần
                },
            });
    
            alert('Avatar updated successfully!');
            navigate(`/account/${id}`); // Điều hướng lại trang account
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setError('Failed to upload avatar');
        }
    };            

    return (
        <div className={styles.updateAvatarPage}>
            <h2>Update Avatar</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Avatar:
                    <input 
                        type="file" 
                        name="avatar" 
                        onChange={handleAvatarChange} 
                        accept="image/*"
                    />
                </label>
                <button type="submit">Upload Avatar</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default UpdateAvatarPage;