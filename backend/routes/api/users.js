const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/Users');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please Enter a valid email').isEmail(),
    check(
      'password',
      'Please enter password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exist' }] });
      }
      const avatar = gravatar.url(email, {
        ss: '200',
        rr: 'pg',
        dd: 'mm'
      });
      user = new User({
        name,
        email,
        avatar,
        password
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).json({ err: 'Server Error' });
    }
  }
);

module.exports = router;
