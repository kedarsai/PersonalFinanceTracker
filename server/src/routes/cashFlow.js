const express = require('express');
const router = express.Router();

// Income routes
router.get('/income', (req, res) => {
  res.json({ message: 'Get income records - to be implemented' });
});

router.post('/income', (req, res) => {
  res.json({ message: 'Create income record - to be implemented' });
});

router.put('/income/:id', (req, res) => {
  res.json({ message: `Update income record ${req.params.id} - to be implemented` });
});

router.delete('/income/:id', (req, res) => {
  res.json({ message: `Delete income record ${req.params.id} - to be implemented` });
});

// Expense routes
router.get('/expenses', (req, res) => {
  res.json({ message: 'Get expense records - to be implemented' });
});

router.post('/expenses', (req, res) => {
  res.json({ message: 'Create expense record - to be implemented' });
});

router.put('/expenses/:id', (req, res) => {
  res.json({ message: `Update expense record ${req.params.id} - to be implemented` });
});

router.delete('/expenses/:id', (req, res) => {
  res.json({ message: `Delete expense record ${req.params.id} - to be implemented` });
});

module.exports = router;