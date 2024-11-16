// controllers/visitController.js
const Visit = require('../models/Visit');
// Hàm tăng số lượt truy cập
exports.incrementVisit = async (req, res) => {
    try {
        let visit = await Visit.findOne();
        if (!visit) {
            visit = new Visit();
        }
        visit.count += 1;
        await visit.save();
        res.status(200).json({ count: visit.count });
    } catch (error) {
        console.error('Error incrementing visit:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Hàm lấy số lượt truy cập hiện tại
exports.getVisitCount = async (req, res) => {
    try {
        const visit = await Visit.findOne();
        const count = visit ? visit.count : 0;
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching visit count:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};
