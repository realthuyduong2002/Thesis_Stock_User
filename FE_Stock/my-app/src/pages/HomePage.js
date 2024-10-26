import React from 'react';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import NewsSection from '../components/home/NewsSection';
import MarketSummary from '../components/home/MarketSummary';
import LatestUpdates from '../components/home/LatestUpdates';
import Footer from '../components/common/Footer';

const HomePage = () => (
    <div className="homepage">
        <Header />
        <Navbar />
        <main className="main-content">
            <NewsSection />
            <MarketSummary />
            <LatestUpdates />
        </main>
        <Footer />
    </div>
);

export default HomePage;
