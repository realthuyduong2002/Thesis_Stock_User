import React from 'react';
import StockTable from '../components/common/StockTable';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MarketPage = () => {
    return (
        <div>
            <Navbar />
            <Header />
            <StockTable />
            <Footer />
        </div>
    );
};

export default MarketPage;
