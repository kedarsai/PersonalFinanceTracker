const Asset = require('../models/Asset');
const { validate, investmentSchema, cashAccountSchema, physicalAssetSchema, ownershipStakeSchema } = require('../middleware/validation');

// Investment Controllers
const getInvestments = async (req, res, next) => {
  try {
    const investments = await Asset.getAllInvestments();
    res.json(investments);
  } catch (error) {
    next(error);
  }
};

const getInvestment = async (req, res, next) => {
  try {
    const investment = await Asset.getInvestmentById(req.params.id);
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json(investment);
  } catch (error) {
    next(error);
  }
};

const createInvestment = async (req, res, next) => {
  try {
    const { error } = investmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const investment = await Asset.createInvestment(req.body);
    res.status(201).json(investment);
  } catch (error) {
    next(error);
  }
};

const updateInvestment = async (req, res, next) => {
  try {
    const { error } = investmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const investment = await Asset.updateInvestment(req.params.id, req.body);
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json(investment);
  } catch (error) {
    next(error);
  }
};

const deleteInvestment = async (req, res, next) => {
  try {
    const deleted = await Asset.deleteInvestment(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Cash Account Controllers
const getCashAccounts = async (req, res, next) => {
  try {
    const accounts = await Asset.getAllCashAccounts();
    res.json(accounts);
  } catch (error) {
    next(error);
  }
};

const getCashAccount = async (req, res, next) => {
  try {
    const account = await Asset.getCashAccountById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Cash account not found' });
    }
    res.json(account);
  } catch (error) {
    next(error);
  }
};

const createCashAccount = async (req, res, next) => {
  try {
    const { error } = cashAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const account = await Asset.createCashAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

const updateCashAccount = async (req, res, next) => {
  try {
    const { error } = cashAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const account = await Asset.updateCashAccount(req.params.id, req.body);
    if (!account) {
      return res.status(404).json({ error: 'Cash account not found' });
    }
    res.json(account);
  } catch (error) {
    next(error);
  }
};

const deleteCashAccount = async (req, res, next) => {
  try {
    const deleted = await Asset.deleteCashAccount(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Cash account not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Physical Asset Controllers
const getPhysicalAssets = async (req, res, next) => {
  try {
    const assets = await Asset.getAllPhysicalAssets();
    res.json(assets);
  } catch (error) {
    next(error);
  }
};

const getPhysicalAsset = async (req, res, next) => {
  try {
    const asset = await Asset.getPhysicalAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Physical asset not found' });
    }
    res.json(asset);
  } catch (error) {
    next(error);
  }
};

const createPhysicalAsset = async (req, res, next) => {
  try {
    const { error } = physicalAssetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const asset = await Asset.createPhysicalAsset(req.body);
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

const updatePhysicalAsset = async (req, res, next) => {
  try {
    const { error } = physicalAssetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const asset = await Asset.updatePhysicalAsset(req.params.id, req.body);
    if (!asset) {
      return res.status(404).json({ error: 'Physical asset not found' });
    }
    res.json(asset);
  } catch (error) {
    next(error);
  }
};

const deletePhysicalAsset = async (req, res, next) => {
  try {
    const deleted = await Asset.deletePhysicalAsset(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Physical asset not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Ownership Stake Controllers
const getOwnershipStakes = async (req, res, next) => {
  try {
    const stakes = await Asset.getAllOwnershipStakes();
    res.json(stakes);
  } catch (error) {
    next(error);
  }
};

const getOwnershipStake = async (req, res, next) => {
  try {
    const stake = await Asset.getOwnershipStakeById(req.params.id);
    if (!stake) {
      return res.status(404).json({ error: 'Ownership stake not found' });
    }
    res.json(stake);
  } catch (error) {
    next(error);
  }
};

const createOwnershipStake = async (req, res, next) => {
  try {
    const { error } = ownershipStakeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const stake = await Asset.createOwnershipStake(req.body);
    res.status(201).json(stake);
  } catch (error) {
    next(error);
  }
};

const updateOwnershipStake = async (req, res, next) => {
  try {
    const { error } = ownershipStakeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const stake = await Asset.updateOwnershipStake(req.params.id, req.body);
    if (!stake) {
      return res.status(404).json({ error: 'Ownership stake not found' });
    }
    res.json(stake);
  } catch (error) {
    next(error);
  }
};

const deleteOwnershipStake = async (req, res, next) => {
  try {
    const deleted = await Asset.deleteOwnershipStake(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ownership stake not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Summary Controllers
const getAssetSummary = async (req, res, next) => {
  try {
    const summary = await Asset.getTotalAssetValue();
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

const getAssetBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Asset.getAssetBreakdown();
    res.json(breakdown);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Investment routes
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  
  // Cash account routes
  getCashAccounts,
  getCashAccount,
  createCashAccount,
  updateCashAccount,
  deleteCashAccount,
  
  // Physical asset routes
  getPhysicalAssets,
  getPhysicalAsset,
  createPhysicalAsset,
  updatePhysicalAsset,
  deletePhysicalAsset,
  
  // Ownership stake routes
  getOwnershipStakes,
  getOwnershipStake,
  createOwnershipStake,
  updateOwnershipStake,
  deleteOwnershipStake,
  
  // Summary routes
  getAssetSummary,
  getAssetBreakdown
};