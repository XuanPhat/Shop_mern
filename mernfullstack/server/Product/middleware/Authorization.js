const jwt = require('jsonwebtoken');
const Middleware = (req, res, next) => {
  const Authheader = req.header('Authorization');
  const Token = Authheader && Authheader.split(' ')[1];
  if (!Token) {
    return res.status(401).json({ success: false, message: 'Token invalid' });
  }
  try {
    const decoded = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, message: 'Token malformed' });
  }
};
module.exports = Middleware;
