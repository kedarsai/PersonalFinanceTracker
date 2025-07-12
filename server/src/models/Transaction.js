const db = require('./database');

class Transaction {
  // Income methods
  static async getAllIncome(startDate = null, endDate = null) {
    let query = 'SELECT * FROM income';
    let params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params = [startDate, endDate];
    } else if (startDate) {
      query += ' WHERE date >= ?';
      params = [startDate];
    } else if (endDate) {
      query += ' WHERE date <= ?';
      params = [endDate];
    }

    query += ' ORDER BY date DESC';
    return await db.all(query, params);
  }

  static async getIncomeById(id) {
    return await db.get('SELECT * FROM income WHERE id = ?', [id]);
  }

  static async createIncome(income) {
    const { source, amount, date, category, is_recurring, frequency, notes } = income;
    const result = await db.run(
      `INSERT INTO income (source, amount, date, category, is_recurring, frequency, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [source, amount, date, category, is_recurring || false, frequency, notes]
    );
    return { id: result.id, ...income };
  }

  static async updateIncome(id, income) {
    const { source, amount, date, category, is_recurring, frequency, notes } = income;
    await db.run(
      `UPDATE income 
       SET source = ?, amount = ?, date = ?, category = ?, 
           is_recurring = ?, frequency = ?, notes = ?
       WHERE id = ?`,
      [source, amount, date, category, is_recurring || false, frequency, notes, id]
    );
    return await this.getIncomeById(id);
  }

  static async deleteIncome(id) {
    const result = await db.run('DELETE FROM income WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Expense methods
  static async getAllExpenses(startDate = null, endDate = null) {
    let query = 'SELECT * FROM expenses';
    let params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params = [startDate, endDate];
    } else if (startDate) {
      query += ' WHERE date >= ?';
      params = [startDate];
    } else if (endDate) {
      query += ' WHERE date <= ?';
      params = [endDate];
    }

    query += ' ORDER BY date DESC';
    return await db.all(query, params);
  }

  static async getExpenseById(id) {
    return await db.get('SELECT * FROM expenses WHERE id = ?', [id]);
  }

  static async createExpense(expense) {
    const { description, amount, date, category, is_recurring, frequency, notes } = expense;
    const result = await db.run(
      `INSERT INTO expenses (description, amount, date, category, is_recurring, frequency, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [description, amount, date, category, is_recurring || false, frequency, notes]
    );
    return { id: result.id, ...expense };
  }

  static async updateExpense(id, expense) {
    const { description, amount, date, category, is_recurring, frequency, notes } = expense;
    await db.run(
      `UPDATE expenses 
       SET description = ?, amount = ?, date = ?, category = ?, 
           is_recurring = ?, frequency = ?, notes = ?
       WHERE id = ?`,
      [description, amount, date, category, is_recurring || false, frequency, notes, id]
    );
    return await this.getExpenseById(id);
  }

  static async deleteExpense(id) {
    const result = await db.run('DELETE FROM expenses WHERE id = ?', [id]);
    return result.changes > 0;
  }

  // Cash flow analysis methods
  static async getCashFlowSummary(startDate, endDate) {
    const incomeResult = await db.get(
      'SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE date BETWEEN ? AND ?',
      [startDate, endDate]
    );
    
    const expenseResult = await db.get(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE date BETWEEN ? AND ?',
      [startDate, endDate]
    );

    const totalIncome = incomeResult.total;
    const totalExpenses = expenseResult.total;
    const netCashFlow = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netCashFlow,
      period: { startDate, endDate }
    };
  }

  static async getIncomeByCategory(startDate = null, endDate = null) {
    let query = 'SELECT category, SUM(amount) as total FROM income';
    let params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    query += ' GROUP BY category ORDER BY total DESC';
    return await db.all(query, params);
  }

  static async getExpensesByCategory(startDate = null, endDate = null) {
    let query = 'SELECT category, SUM(amount) as total FROM expenses';
    let params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    query += ' GROUP BY category ORDER BY total DESC';
    return await db.all(query, params);
  }

  static async getMonthlyCashFlow(year = new Date().getFullYear()) {
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
      
      const summary = await this.getCashFlowSummary(startDate, endDate);
      
      monthlyData.push({
        month: month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        ...summary
      });
    }
    
    return monthlyData;
  }

  static async getRecurringTransactions() {
    const recurringIncome = await db.all(
      'SELECT *, "income" as type FROM income WHERE is_recurring = true'
    );
    
    const recurringExpenses = await db.all(
      'SELECT *, "expense" as type FROM expenses WHERE is_recurring = true'
    );

    return {
      income: recurringIncome,
      expenses: recurringExpenses,
      totalRecurringIncome: recurringIncome.reduce((sum, item) => sum + item.amount, 0),
      totalRecurringExpenses: recurringExpenses.reduce((sum, item) => sum + item.amount, 0)
    };
  }

  static async getRecentTransactions(limit = 10) {
    const recentIncome = await db.all(
      'SELECT *, "income" as type FROM income ORDER BY created_at DESC LIMIT ?',
      [Math.ceil(limit / 2)]
    );
    
    const recentExpenses = await db.all(
      'SELECT *, "expense" as type FROM expenses ORDER BY created_at DESC LIMIT ?',
      [Math.ceil(limit / 2)]
    );

    // Combine and sort by created_at
    const allTransactions = [...recentIncome, ...recentExpenses]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    return allTransactions;
  }
}

module.exports = Transaction;