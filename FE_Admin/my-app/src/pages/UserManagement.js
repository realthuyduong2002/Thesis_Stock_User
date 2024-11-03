import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        role: '',
        firstName: '',
        lastName: '',
        preferredName: '',
        gender: '',
        phoneNumber: '',
        country: '',
    });
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 10;

    // Lấy token từ localStorage hoặc nơi lưu trữ khác
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            preferredName: user.preferredName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            country: user.country,
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                console.error(err);
                setError('Failed to delete user');
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.map(user => user._id === editingUser._id ? res.data.user : user));
            setEditingUser(null);
            setUpdating(false);
        } catch (err) {
            console.error(err);
            setError('Failed to update user');
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setEditingUser(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Filter users theo search term
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = currentPage * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const displayedUsers = filteredUsers.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Loading users...</span>
            </div>
        );
    }

    return (
        <div className="user-management-container">
            <div className="header-actions">
                <h2>Quản Lý Người Dùng</h2>
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="table-responsive">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Họ</th>
                            <th>Tên</th>
                            <th>Tên Ưa Thích</th>
                            <th>Giới Tính</th>
                            <th>Số Điện Thoại</th>
                            <th>Quốc Gia</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.preferredName}</td>
                                <td>{user.gender}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.country}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEditClick(user)} className="edit-button">
                                            <FaEdit /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(user._id)} className="delete-button">
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân Trang */}
            <div className="pagination">
                {Array.from({ length: pageCount }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(index)}
                        className={`page-button ${currentPage === index ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Modal Chỉnh Sửa Người Dùng */}
            {editingUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Chỉnh Sửa Người Dùng</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role:</label>
                                <select name="role" value={formData.role} onChange={handleInputChange}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Họ:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên Ưa Thích:</label>
                                <input
                                    type="text"
                                    name="preferredName"
                                    value={formData.preferredName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Giới Tính:</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Số Điện Thoại:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Quốc Gia:</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" disabled={updating}>
                                    {updating ? 'Updating...' : 'Update'}
                                </button>
                                <button type="button" onClick={handleCancel} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
