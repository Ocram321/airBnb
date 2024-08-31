// backend/routes/api/index.js
const router = require('express').Router();

const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');

// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');



// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
  router.use(restoreUser);


module.exports = router;