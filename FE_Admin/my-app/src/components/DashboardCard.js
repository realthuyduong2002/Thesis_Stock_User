// DashboardCard.js
import React from 'react';
import '../components/DashboardCard.css';

const DashboardCard = () => {
    return (
        <div className="dashboard-cards">
            <div className="card">
                <span className="card-title">Users</span>
                <strong>1,000</strong>
            </div>
            <div className="card">
                <span className="card-title">Stocks</span>
                <strong>1,000</strong>
            </div>
            <div className="card">
                <span className="card-title">Transactions</span>
                <strong>1,000</strong>
            </div>
        </div>
    );
};

export default DashboardCard;
