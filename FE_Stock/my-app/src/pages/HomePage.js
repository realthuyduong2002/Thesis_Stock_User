import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../pages/HomePage.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 10; // Number of news items to display per page
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('query') || 'stocks OR finance';

        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://newsapi.org/v2/everything', {
                    params: {
                        q: query,
                        apiKey: 'eea2840c76404bee8963ab1d67554a53',
                        language: 'en',
                        sortBy: 'publishedAt',
                    },
                });
                setNews(response.data.articles);
            } catch (error) {
                setError('Failed to load news');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [location.search]);

    const handleArticleClick = (article) => {
        navigate(`/article/${encodeURIComponent(article.title)}`, { state: { article } });
    };

    // Calculate the indices of the current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(news.length / itemsPerPage);

    return (
        <div className="homepage">
            <Header />
            <Navbar />
            <main className="main-content">
                {loading && <p>Loading news...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && currentItems.length > 0 && (
                    <section className="news-section">
                        <h2>Latest Stock News</h2>
                        <ul>
                            {currentItems.map((article, index) => (
                                <li
                                    key={index}
                                    className="news-item"
                                    onClick={() => handleArticleClick(article)}
                                >
                                    <div className="news-content">
                                        <h3>{article.title}</h3>
                                        <p>{article.description || 'No description available'}</p>
                                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                    {article.urlToImage && (
                                        <img
                                            src={article.urlToImage}
                                            alt={article.title}
                                            className="news-image"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                        {/* Pagination controls */}
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                <FaArrowLeft />
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </section>
                )}
                {!loading && !error && news.length === 0 && (
                    <p>No news available for the current search criteria.</p>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
