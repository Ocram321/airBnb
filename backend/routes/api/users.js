// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    // check('password')
    //   .exists({ checkFalsy: true })
    //   .isLength({ min: 6 })
    //   .withMessage('Please provide a password of 6 Characters or more.'),
    check('firstName')
      .exists({checkFalsy: true})
      .withMessage('Please provide a first Name.'),
    check('lastName')
      .exists({checkFalsy: true})
      .withMessage('Please provide a last name.'),
    handleValidationErrors
  ];
  

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

   
    const userEmail = await User.findOne({
      where: { email }
    })
    const userUsername = await User.findOne({
      where: { username }
    });

    const errors = {};

    if (userEmail) {
      errors.email = "User with that email already exists";
    }
    if (userUsername) {
      errors.username = 'User with that username already exists';
    }

    if (userEmail || userUsername) {
      return res.status(500).json({
        message: 'User already exists',
        errors
      });
    }
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      const safeUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
      res.status(201)
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;