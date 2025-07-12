const express = require('express');
const router = express.Router();

// Dashboard routes
router.get('/summary', (req, res) => {
  res.json({ message: 'Get dashboard summary - to be implemented' });
});

router.get('/networth', (req, res) => {
  res.json({ message: 'Get net worth history - to be implemented' });
});

router.get('/cashflow', (req, res) => {
  res.json({ message: 'Get cash flow summary - to be implemented' });
});

module.exports = router;