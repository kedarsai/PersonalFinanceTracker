const db = require('./database');

class Asset {
  // Investment methods
  static async getAllInvestments() {
    return await db.all('SELECT * FROM investments ORDER BY created_at DESC');
  }

  static async getInvestmentById(id) {
    return await db.get('SELECT * FROM investments WHERE id = ?', [id]);
  }

  static async createInvestment(investment) {
    const { name, type, symbol, shares, price_per_share, total_value, purchase_date } = investment;
    const result = await db.run(
      `INSERT INTO investments (name, type, symbol, shares, price_per_share, total_value, purchase_date, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, type, symbol, shares, price_per_share, total_value, purchase_date]
    );
    return { id: result.id, ...investment };
  }

  static async updateInvestment(id, investment) {
    const { name, type, symbol, shares, price_per_share, total_value, purchase_date } = investment;
    await db.run(
      `UPDATE investments 
       SET name = ?, type = ?, symbol = ?, shares = ?, price_per_share = ?, 
           total_value = ?, purchase_date = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, type, symbol, shares, price_per_share, total_value, purchase_date, id]
    );
    return await this.getInvestmentById(id);
  }

  static async deleteInvestment(id) {
    const result = await db.run('DELETE FROM investments WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Cash Account methods
  static async getAllCashAccounts() {
    return await db.all('SELECT * FROM cash_accounts ORDER BY created_at DESC');
  }

  static async getCashAccountById(id) {
    return await db.get('SELECT * FROM cash_accounts WHERE id = ?', [id]);
  }

  static async createCashAccount(account) {
    const { name, account_type, balance, interest_rate } = account;
    const result = await db.run(
      `INSERT INTO cash_accounts (name, account_type, balance, interest_rate, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, account_type, balance, interest_rate || 0]
    );
    return { id: result.id, ...account };
  }

  static async updateCashAccount(id, account) {
    const { name, account_type, balance, interest_rate } = account;
    await db.run(
      `UPDATE cash_accounts 
       SET name = ?, account_type = ?, balance = ?, interest_rate = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, account_type, balance, interest_rate || 0, id]
    );
    return await this.getCashAccountById(id);
  }

  static async deleteCashAccount(id) {
    const result = await db.run('DELETE FROM cash_accounts WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Physical Asset methods
  static async getAllPhysicalAssets() {
    return await db.all('SELECT * FROM physical_assets ORDER BY created_at DESC');
  }

  static async getPhysicalAssetById(id) {
    return await db.get('SELECT * FROM physical_assets WHERE id = ?', [id]);
  }

  static async createPhysicalAsset(asset) {
    const { name, category, current_value, purchase_value, purchase_date, condition, notes } = asset;
    const result = await db.run(
      `INSERT INTO physical_assets (name, category, current_value, purchase_value, purchase_date, condition, notes, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, category, current_value, purchase_value, purchase_date, condition, notes]
    );
    return { id: result.id, ...asset };
  }

  static async updatePhysicalAsset(id, asset) {
    const { name, category, current_value, purchase_value, purchase_date, condition, notes } = asset;
    await db.run(
      `UPDATE physical_assets 
       SET name = ?, category = ?, current_value = ?, purchase_value = ?, 
           purchase_date = ?, condition = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, category, current_value, purchase_value, purchase_date, condition, notes, id]
    );
    return await this.getPhysicalAssetById(id);
  }

  static async deletePhysicalAsset(id) {
    const result = await db.run('DELETE FROM physical_assets WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Ownership Stake methods
  static async getAllOwnershipStakes() {
    return await db.all('SELECT * FROM ownership_stakes ORDER BY created_at DESC');
  }

  static async getOwnershipStakeById(id) {
    return await db.get('SELECT * FROM ownership_stakes WHERE id = ?', [id]);
  }

  static async createOwnershipStake(stake) {
    const { name, business_name, percentage, current_value, investment_date, notes } = stake;
    const result = await db.run(
      `INSERT INTO ownership_stakes (name, business_name, percentage, current_value, investment_date, notes, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, business_name, percentage, current_value, investment_date, notes]
    );
    return { id: result.id, ...stake };
  }

  static async updateOwnershipStake(id, stake) {
    const { name, business_name, percentage, current_value, investment_date, notes } = stake;
    await db.run(
      `UPDATE ownership_stakes 
       SET name = ?, business_name = ?, percentage = ?, current_value = ?, 
           investment_date = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, business_name, percentage, current_value, investment_date, notes, id]
    );
    return await this.getOwnershipStakeById(id);
  }

  static async deleteOwnershipStake(id) {
    const result = await db.run('DELETE FROM ownership_stakes WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Summary methods
  static async getTotalAssetValue() {
    const investments = await db.get('SELECT COALESCE(SUM(total_value), 0) as total FROM investments');
    const cash = await db.get('SELECT COALESCE(SUM(balance), 0) as total FROM cash_accounts');
    const physical = await db.get('SELECT COALESCE(SUM(current_value), 0) as total FROM physical_assets');
    const ownership = await db.get('SELECT COALESCE(SUM(current_value), 0) as total FROM ownership_stakes');

    return {
      investments: investments.total,
      cash: cash.total,
      physical: physical.total,
      ownership: ownership.total,
      total: investments.total + cash.total + physical.total + ownership.total
    };
  }

  static async getAssetBreakdown() {
    const investments = await db.all('SELECT type, SUM(total_value) as value FROM investments GROUP BY type');
    const cashAccounts = await db.all('SELECT account_type, SUM(balance) as value FROM cash_accounts GROUP BY account_type');
    const physicalAssets = await db.all('SELECT category, SUM(current_value) as value FROM physical_assets GROUP BY category');
    
    return {
      investments,
      cashAccounts,
      physicalAssets
    };
  }
}

module.exports = Asset;