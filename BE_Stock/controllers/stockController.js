// controllers/stockController.js
const yahooFinance = require('yahoo-finance2').default;

const getStockPrice = async (req, res) => {
    try {
        const { symbol } = req.params; // Lấy mã cổ phiếu từ URL
        const data = await yahooFinance.quote(symbol); // Gọi API của Yahoo Finance
        
        res.json(data); // Trả về dữ liệu cho frontend
    } catch (error) {
        console.error("Error fetching stock price:", error);
        res.status(500).json({ error: "Failed to fetch stock price data" });
    }
};

module.exports = { getStockPrice };
