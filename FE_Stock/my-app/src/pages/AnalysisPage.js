import React from 'react';
import '../pages/AnalysisPage.css';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const AnalysisPage = () => {
    return (
        <div>
            <Navbar />
            <Header />
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
