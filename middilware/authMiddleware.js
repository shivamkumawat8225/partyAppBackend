// filepath: /c:/Users/Admin/Desktop/new task/surveyapp/server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send('Access denied');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log("Token expired at:", err.expiredAt);
        return res.status(403).send('Token expired');
      } else {
        console.log("errrr", err);
        return res.status(403).send('Invalid token');
      }
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };