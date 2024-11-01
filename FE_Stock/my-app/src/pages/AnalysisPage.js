import React from 'react';
import './AnalysisPage.css';

const AnalysisPage = () => {
    return (
        <div className="analysis-page-container">
            <h1>Stock Analysis Dashboard</h1>
            <iframe
                src="https://thesis-dashboard.onrender.com/"
                title="Stock Price Predictions Dashboard"
                className="dashboard-iframe"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default AnalysisPage;