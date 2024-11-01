import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import './StockTable.css';

const StockTable = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const isFetchingRef = useRef(false); // To prevent overlapping fetches

    // Initialize stock symbols with useMemo
    const stockSymbols = useMemo(() => [
        'NVDA', 'INTC', 'PLTR', 'TSLA', 'AAPL', 'BBD', 'T', 'SOFI',
        'WBD', 'SNAP', 'NIO', 'BTG', 'F', 'AAL', 'NOK', 'BAC',
        'CCL', 'ORCL', 'AMD', 'PFE', 'KGC', 'MARA', 'SLB', 'NU',
        'MPW', 'MU', 'LCID', 'NCLH', 'RIG', 'AMZN', 'ABEV', 'U',
        'LUMN', 'AGNC', 'VZ', 'WBA', 'WFC', 'RIVN', 'UPST', 'CFE',
        'CSCO', 'VALE', 'AVGO', 'PBR', 'GOOGL', 'SMMT', 'GOLD',
        'NGC', 'BCS', 'UAA'
    ], []);

    // API key from environment variables
    const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

    // Function to save stocks to localStorage
    const saveStocksToLocalStorage = (stocksData) => {
        try {
            const serializedData = JSON.stringify(stocksData);
            localStorage.setItem('stocksData', serializedData);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    // Function to load stocks from localStorage
    const loadStocksFromLocalStorage = () => {
        try {
            const serializedData = localStorage.getItem('stocksData');
            if (serializedData === null) return [];
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return [];
        }
    };

    // Function to fetch stock data from RealStonks API
    const fetchStockData = async (symbol) => {
        const options = {
            method: 'GET',
            url: `https://realstonks.p.rapidapi.com/stocks/${symbol}/advanced`,
            headers: {
                'x-rapidapi-host': 'realstonks.p.rapidapi.com',
                'x-rapidapi-key': RAPIDAPI_KEY,
            },
        };

        try {
            const response = await axios.request(options);
            const data = response.data;

            if (data) {
                setStocks(prevStocks => {
                    const isExisting = prevStocks.some(stock => stock.symbol === symbol);
                    if (isExisting) {
                        // Update existing stock data
                        const updatedStocks = prevStocks.map(stock =>
                            stock.symbol === symbol
                                ? {
                                    ...stock,
                                    companyName: data.symbolName || stock.companyName,
                                    price: data.lastPrice !== undefined ? data.lastPrice : stock.price,
                                    change: data.percentChange !== undefined ? (data.percentChange * 100) : stock.change,
                                    volume: data.volume !== undefined ? data.volume.toLocaleString() : stock.volume,
                                }
                                : stock
                        );
                        // Save to localStorage
                        saveStocksToLocalStorage(updatedStocks);
                        return updatedStocks;
                    }

                    // Add new stock if it doesn't exist
                    const newStock = {
                        symbol: data.symbol || symbol,
                        companyName: data.symbolName || symbol,
                        price: data.lastPrice !== undefined ? data.lastPrice : 'N/A',
                        change: data.percentChange !== undefined ? (data.percentChange * 100) : 0, // Convert to percentage
                        volume: data.volume !== undefined ? data.volume.toLocaleString() : '0',
                    };
                    const updatedStocks = [...prevStocks, newStock];
                    // Save to localStorage
                    saveStocksToLocalStorage(updatedStocks);
                    return updatedStocks;
                });
            } else {
                console.error(`No data found for stock ${symbol}.`);
            }
        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
        }
    };

    // Function to fetch all stock data with controlled rate limiting
    const fetchAllStockData = useCallback(async () => {
        if (isFetchingRef.current) {
            console.warn('Fetch operation already in progress.');
            return;
        }

        isFetchingRef.current = true;
        setUpdating(true);

        try {
            for (let i = 0; i < stockSymbols.length; i++) {
                const symbol = stockSymbols[i];
                await fetchStockData(symbol);
                // Wait for 1.5 seconds between requests to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        } catch (error) {
            console.error('Error in fetchAllStockData:', error);
        } finally {
            isFetchingRef.current = false;
            setLoading(false); // Only set loading to false after initial load
            setUpdating(false);
        }
    }, [stockSymbols]);

    useEffect(() => {
        // Load data from localStorage on mount
        const savedStocks = loadStocksFromLocalStorage();
        if (savedStocks.length > 0) {
            setStocks(savedStocks);
            setLoading(false);
        }

        // Fetch new data
        fetchAllStockData();

        // Set up interval for periodic updates
        const interval = setInterval(() => {
            fetchAllStockData();
        }, 15 * 60 * 1000); // Refresh every 15 minutes

        return () => clearInterval(interval); // Cleanup on unmount
    }, [fetchAllStockData]);

    return (
        <div className="stock-table-container">
            <h2>Stock Market Prices</h2>
            {loading && (
                <div className="loading-indicator" aria-label="Loading">
                    <div className="spinner"></div>
                </div>
            )}
            {updating && !loading && (
                <div className="updating-indicator" aria-label="Updating">
                    <div className="spinner"></div>
                    <span>Updating Stock Prices...</span>
                </div>
            )}
            <div className="table-responsive">
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>Stock Code</th>
                            <th>Company Name</th>
                            <th>Current Price</th>
                            <th>Change (%)</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock, index) => (
                            <tr key={stock.symbol}>
                                <td>{stock.symbol}</td>
                                <td>{stock.companyName}</td>
                                <td className="price">${stock.price}</td>
                                <td className={stock.change >= 0 ? 'change-positive' : 'change-negative'}>
                                    {typeof stock.change === 'number' ? stock.change.toFixed(2) : stock.change}%
                                </td>
                                <td>{stock.volume}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockTable;