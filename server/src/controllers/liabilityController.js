const Liability = require('../models/Liability');
const { liabilitySchema } = require('../middleware/validation');

const getLiabilities = async (req, res, next) => {
  try {
    const liabilities = await Liability.getAll();
    res.json(liabilities);
  } catch (error) {
    next(error);
  }
};

const getLiability = async (req, res, next) => {
  try {
    const liability = await Liability.getById(req.params.id);
    if (!liability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    res.json(liability);
  } catch (error) {
    next(error);
  }
};

const createLiability = async (req, res, next) => {
  try {
    const { error } = liabilitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const liability = await Liability.create(req.body);
    res.status(201).json(liability);
  } catch (error) {
    next(error);
  }
};

const updateLiability = async (req, res, next) => {
  try {
    const { error } = liabilitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const liability = await Liability.update(req.params.id, req.body);
    if (!liability) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    res.json(liability);
  } catch (error) {
    next(error);
  }
};

const deleteLiability = async (req, res, next) => {
  try {
    const deleted = await Liability.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Liability not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getLiabilitySummary = async (req, res, next) => {
  try {
    const totalLiabilities = await Liability.getTotalLiabilities();
    const liabilitiesByCategory = await Liability.getLiabilitiesByCategory();
    const totalMonthlyPayments = await Liability.getTotalMonthlyPayments();
    const payoffProjections = await Liability.getPayoffProjections();
    
    res.json({
      totalLiabilities,
      liabilitiesByCategory,
      totalMonthlyPayments,
      payoffProjections
    });
  } catch (error) {
    next(error);
  }
};

const getUpcomingPayments = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const upcomingPayments = await Liability.getUpcomingPayments(days);
    res.json(upcomingPayments);
  } catch (error) {
    next(error);
  }
};

const getPayoffProjections = async (req, res, next) => {
  try {
    const projections = await Liability.getPayoffProjections();
    res.json(projections);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLiabilities,
  getLiability,
  createLiability,
  updateLiability,
  deleteLiability,
  getLiabilitySummary,
  getUpcomingPayments,
  getPayoffProjections
};