const jwt = require('jsonwebtoken');
const config = require('config');

//middleware callback
module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');
  //check if no token
  if (!token) {
    //401 not authorized
    return res.status(401).json({ msg: 'No token, Authorization denied' });
  }
  try {
    //verify token to get data from payload
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //assigning the req.user to have the payload user object
    req.user = decoded.user;
    // moving on to the routes
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
