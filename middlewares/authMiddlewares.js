const Employee = require('../models/employeeModel');
const Candidate = require('../models/CandidateModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const candidate = await Candidate.findById(decoded.id);
                req.user = candidate;
                next();
            }
        } catch (err) {
            res.status(401).json({ message: 'Authorized token expired, please login again.' });
        }
    } else {
        res.status(401).json({ message: 'No token attached with the header.' });
    }
});

module.exports = { authMiddleware};
