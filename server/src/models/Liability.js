const db = require('./database');

class Liability {
  static async getAll() {
    return await db.all('SELECT * FROM liabilities ORDER BY created_at DESC');
  }

  static async getById(id) {
    return await db.get('SELECT * FROM liabilities WHERE id = ?', [id]);
  }

  static async create(liability) {
    const { 
      name, 
      category, 
      principal_amount, 
      current_balance, 
      interest_rate, 
      monthly_payment, 
      due_date, 
      notes 
    } = liability;
    
    const result = await db.run(
      `INSERT INTO liabilities (
        name, category, principal_amount, current_balance, 
        interest_rate, monthly_payment, due_date, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        name, 
        category, 
        principal_amount, 
        current_balance, 
        interest_rate || 0, 
        monthly_payment || 0, 
        due_date, 
        notes
      ]
    );
    
    return { id: result.id, ...liability };
  }

  static async update(id, liability) {
    const { 
      name, 
      category, 
      principal_amount, 
      current_balance, 
      interest_rate, 
      monthly_payment, 
      due_date, 
      notes 
    } = liability;
    
    await db.run(
      `UPDATE liabilities 
       SET name = ?, category = ?, principal_amount = ?, current_balance = ?, 
           interest_rate = ?, monthly_payment = ?, due_date = ?, notes = ?, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name, 
        category, 
        principal_amount, 
        current_balance, 
        interest_rate || 0, 
        monthly_payment || 0, 
        due_date, 
        notes, 
        id
      ]
    );
    
    return await this.getById(id);
  }

  static async delete(id) {
    const result = await db.run('DELETE FROM liabilities WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static async getTotalLiabilities() {
    const result = await db.get('SELECT COALESCE(SUM(current_balance), 0) as total FROM liabilities');
    return result.total;
  }

  static async getLiabilitiesByCategory() {
    return await db.all(
      'SELECT category, SUM(current_balance) as total FROM liabilities GROUP BY category ORDER BY total DESC'
    );
  }

  static async getUpcomingPayments(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db.all(
      `SELECT * FROM liabilities 
       WHERE due_date IS NOT NULL 
       AND due_date <= ? 
       AND current_balance > 0
       ORDER BY due_date ASC`,
      [futureDate.toISOString().split('T')[0]]
    );
  }

  static async getTotalMonthlyPayments() {
    const result = await db.get('SELECT COALESCE(SUM(monthly_payment), 0) as total FROM liabilities');
    return result.total;
  }

  static async getPayoffProjections() {
    const liabilities = await db.all(
      `SELECT id, name, current_balance, monthly_payment, interest_rate
       FROM liabilities 
       WHERE current_balance > 0 AND monthly_payment > 0`
    );

    return liabilities.map(liability => {
      const { id, name, current_balance, monthly_payment, interest_rate } = liability;
      
      if (monthly_payment <= 0) {
        return { id, name, monthsToPayoff: null, totalInterest: null };
      }

      const monthlyRate = (interest_rate || 0) / 100 / 12;
      
      if (monthlyRate === 0) {
        const monthsToPayoff = Math.ceil(current_balance / monthly_payment);
        return {
          id,
          name,
          monthsToPayoff,
          totalInterest: 0,
          payoffDate: new Date(Date.now() + monthsToPayoff * 30 * 24 * 60 * 60 * 1000)
        };
      }

      // Calculate months to payoff using amortization formula
      const monthsToPayoff = Math.ceil(
        -Math.log(1 - (current_balance * monthlyRate) / monthly_payment) / Math.log(1 + monthlyRate)
      );
      
      const totalInterest = (monthly_payment * monthsToPayoff) - current_balance;
      const payoffDate = new Date(Date.now() + monthsToPayoff * 30 * 24 * 60 * 60 * 1000);

      return {
        id,
        name,
        monthsToPayoff: isFinite(monthsToPayoff) ? monthsToPayoff : null,
        totalInterest: isFinite(totalInterest) ? totalInterest : null,
        payoffDate: isFinite(monthsToPayoff) ? payoffDate : null
      };
    });
  }
}

module.exports = Liability;