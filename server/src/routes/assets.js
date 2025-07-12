const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

// Investment routes
router.get('/investments', assetController.getInvestments);
router.get('/investments/:id', assetController.getInvestment);
router.post('/investments', assetController.createInvestment);
router.put('/investments/:id', assetController.updateInvestment);
router.delete('/investments/:id', assetController.deleteInvestment);

// Cash account routes
router.get('/cash', assetController.getCashAccounts);
router.get('/cash/:id', assetController.getCashAccount);
router.post('/cash', assetController.createCashAccount);
router.put('/cash/:id', assetController.updateCashAccount);
router.delete('/cash/:id', assetController.deleteCashAccount);

// Physical asset routes
router.get('/physical', assetController.getPhysicalAssets);
router.get('/physical/:id', assetController.getPhysicalAsset);
router.post('/physical', assetController.createPhysicalAsset);
router.put('/physical/:id', assetController.updatePhysicalAsset);
router.delete('/physical/:id', assetController.deletePhysicalAsset);

// Ownership stake routes
router.get('/ownership', assetController.getOwnershipStakes);
router.get('/ownership/:id', assetController.getOwnershipStake);
router.post('/ownership', assetController.createOwnershipStake);
router.put('/ownership/:id', assetController.updateOwnershipStake);
router.delete('/ownership/:id', assetController.deleteOwnershipStake);

// Summary routes
router.get('/summary', assetController.getAssetSummary);
router.get('/breakdown', assetController.getAssetBreakdown);

module.exports = router;