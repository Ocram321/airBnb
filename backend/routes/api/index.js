// backend/routes/api/index.js
const router = require('express').Router();

const { restoreUser } = require('../../utils/auth.js');

const { requireAuth } = require('../../utils/auth.js');

router.use(restoreUser);

  // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// const { requireAuth } = require('../../utils/auth.js');


// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null

  router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
  });

module.exports = router;