// HomePage.jsx

import React, { useState, useEffect, useRef } from 'react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollStart, setScrollStart] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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
                        pageSize: 100,
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

    useEffect(() => {
        checkForScrollPosition();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkForScrollPosition);
            window.addEventListener('resize', checkForScrollPosition);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkForScrollPosition);
                window.removeEventListener('resize', checkForScrollPosition);
            }
        };
    }, [news, currentPage]);

    const checkForScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    const handleArticleClick = (article) => {
        navigate(`/article/${encodeURIComponent(article.title)}`, { state: { article } });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(news.length / itemsPerPage);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollStart(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Adjust the scroll speed
        scrollContainerRef.current.scrollLeft = scrollStart - walk;
    };

    const scrollLeftButton = () => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.firstChild.offsetWidth + 20; // card width + margin
            scrollContainerRef.current.scrollBy({
                top: 0,
                left: -cardWidth * 3, // Scroll three cards at a time
                behavior: 'smooth',
            });
        }
    };

    const scrollRightButton = () => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.firstChild.offsetWidth + 20; // card width + margin
            scrollContainerRef.current.scrollBy({
                top: 0,
                left: cardWidth * 3, // Scroll three cards at a time
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="homepage">
            <Header />
            <Navbar />
            <main className="main-content">
                {loading && <p className="loading">Loading news...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && currentItems.length > 0 && (
                    <section className="news-container">
                        <h2 className="news-title">Latest Stock News</h2>

                        {/* Horizontally Draggable News Cards */}
                        <div className="news-card-slider">
                            <button
                                className="scroll-button left"
                                onClick={scrollLeftButton}
                                disabled={!canScrollLeft}
                            >
                                <FaArrowLeft />
                            </button>
                            <div
                                className="news-grid"
                                ref={scrollContainerRef}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                            >
                                {currentItems.map((article, index) => (
                                    <div
                                        key={index}
                                        className="news-card"
                                        onClick={() => handleArticleClick(article)}
                                    >
                                        {article.urlToImage ? (
                                            <img
                                                src={article.urlToImage}
                                                alt={article.title}
                                                className="news-card-image"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="news-card-placeholder">No Image</div>
                                        )}
                                        <div className="news-card-content">
                                            <h3 className="news-card-title">{article.title}</h3>
                                            <p className="news-card-description">
                                                {article.description || 'No description available'}
                                            </p>
                                            <span className="news-card-date">
                                                {new Date(article.publishedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="scroll-button right"
                                onClick={scrollRightButton}
                                disabled={!canScrollRight}
                            >
                                <FaArrowRight />
                            </button>
                        </div>

                        {/* Existing Vertical News List Section */}
                        <div className="news-list-section">
                            <ul className="news-list">
                                {currentItems.map((article, index) => (
                                    <li
                                        key={index}
                                        className="news-list-item"
                                        onClick={() => handleArticleClick(article)}
                                    >
                                        {article.urlToImage && (
                                            <img
                                                src={article.urlToImage}
                                                alt={article.title}
                                                className="news-list-image"
                                                loading="lazy"
                                            />
                                        )}
                                        <div className="news-list-content">
                                            <h3 className="news-list-title">{article.title}</h3>
                                            <span className="news-list-date">
                                                {new Date(article.publishedAt).toLocaleDateString()}
                                            </span>
                                            <p className="news-list-description">
                                                {article.description || 'No description available'}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}
                {!loading && !error && news.length === 0 && (
                    <p>No news available for the current search criteria.</p>
                )}
                {!loading && !error && news.length > 0 && (
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            <FaArrowLeft />
                        </button>
                        <span className="pagination-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );

};

export default HomePage;
