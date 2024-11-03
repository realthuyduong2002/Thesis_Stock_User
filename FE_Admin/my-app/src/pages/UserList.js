import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/UserList.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/api/users')
            .then(response => {
                setUsers(response.data);
                console.log(response.data); // Check if data is correct
            })
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    return (
        <div className="user-list-container">
            <Sidebar />
            <Header />
            <div className="user-list">
                <h1>Users</h1>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`status ${user.status ? user.status.toLowerCase() : ''}`}>
                                        {user.status || 'Unknown'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
