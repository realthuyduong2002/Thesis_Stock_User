import React from 'react';
import '../pages/AnalysisPage.css';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const AnalysisPage = () => {
    return (
        <div>
            <Navbar />
            <iframe
                src="https://thesis-dashboard.onrender.com/"
                title="Stock Price Predictions Dashboard"
                allowFullScreen
            ></iframe>
            <Footer />
        </div>
    );
};

export default AnalysisPage;
