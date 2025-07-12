const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented with controllers
router.get('/', (req, res) => {
  res.json({ message: 'Get liabilities - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create liability - to be implemented' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update liability ${req.params.id} - to be implemented` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete liability ${req.params.id} - to be implemented` });
});

module.exports = router;