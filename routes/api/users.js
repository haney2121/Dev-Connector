const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

//@route  POST api/users
//@desc   Register User
//@access Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    //sending information with error from custom messages in the check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //handling logic and register the users
    const { name, email, password } = req.body;
    try {
      //checking if user already exist
      let user = await User.findOne({ email });
      if (user) {
        //error res is being created the same format as the check for ease on front end
        //return prevents the cannot send headers issue for res.status
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist' }] });
      }
      //getting users gravatar
      const avatar = gravatar.url(email, {
        //size
        s: '200',
        //rating
        r: 'pg',
        //default image
        d: 'mm'
      });
      //creating a new user instance - not saved yet
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //creating salt with 10 recommended by docs.
      const salt = await bcrypt.genSalt(10);
      //salting password  (password, salt) - password is from req.body
      user.password = await bcrypt.hash(password, salt);
      //saving user instance with salted password
      await user.save();
      //will return jsonwebtoken for frontend
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
