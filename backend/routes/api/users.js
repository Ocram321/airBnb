// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Op } = require('sequelize')

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    // check('password')
    //   .exists({ checkFalsy: true })
    //   .isLength({ min: 6 })
    //   .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      const emailUser = await User.findOne({
        where: { email }
      });

      const usernameUser = await User.findOne({
        where: { username }
      });

      const errors = {};

      if (emailUser) {
        errors.email = "User with that email already exists";
      }
  
      if (usernameUser) {
        errors.username = 'User with that username already exists';
      }

      if (emailUser || usernameUser) {
        return res.status(500).json({
          message: 'User already exists',
          errors
        });
      }
  

      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.status(201).json({
        user: safeUser
      });
    }
  );

module.exports = router;