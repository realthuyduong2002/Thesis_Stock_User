import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LineChart from '../components/LineChart';
import StockTable from '../components/StockTable';
import DashboardCard from '../components/DashboardCard';
import '../pages/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="dashboard-content">
                <Header />
                <div className="centered-content">
                    <DashboardCard />
                    <div className="line-chart-container">
                        <LineChart />
                    </div>
                    <div className="stock-table-container">
                        <StockTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;