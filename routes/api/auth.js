const express = require('express');
const router = express.Router();
const User = require('../../models/User');
//middleware for auth token
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

//@route  GET api/auth
//@desc   Test route
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    //getting all user information for the current user minus the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

//@route  POST api/auth
//@desc   Authenticate User & get token
//@access Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    //sending information with error from custom messages in the check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //handling logic and register the users
    const { email, password } = req.body;
    try {
      //checking if user already exist
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid E-mail or Password' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid E-mail or Password' }] });
      }
      //return jsonwebtoken for frontend
      const payload = {
        user: {
          //user is from the user.save() promise
          id: user.id
        }
      };
      //creating the jwt with the payload for user with id, and secret
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        //Additional options for token to expire in 1hr - 3600
        { expiresIn: 360000 },
        //callback function for process the sign after the options
        (err, token) => {
          if (err) throw err;
          //send the token with id created in payload
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
