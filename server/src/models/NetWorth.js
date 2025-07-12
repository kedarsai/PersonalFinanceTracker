const db = require('./database');
const Asset = require('./Asset');
const Liability = require('./Liability');

class NetWorth {
  static async calculateCurrentNetWorth() {
    const assetValues = await Asset.getTotalAssetValue();
    const totalLiabilities = await Liability.getTotalLiabilities();
    
    const netWorth = assetValues.total - totalLiabilities;
    
    return {
      totalAssets: assetValues.total,
      totalLiabilities: totalLiabilities,
      netWorth: netWorth,
      assetBreakdown: assetValues,
      calculatedAt: new Date().toISOString()
    };
  }

  static async saveNetWorthSnapshot(date = null) {
    const currentNetWorth = await this.calculateCurrentNetWorth();
    const snapshotDate = date || new Date().toISOString().split('T')[0];
    
    // Check if snapshot already exists for this date
    const existing = await db.get(
      'SELECT id FROM net_worth_history WHERE date = ?',
      [snapshotDate]
    );
    
    if (existing) {
      // Update existing snapshot
      await db.run(
        `UPDATE net_worth_history 
         SET total_assets = ?, total_liabilities = ?, net_worth = ?
         WHERE date = ?`,
        [
          currentNetWorth.totalAssets,
          currentNetWorth.totalLiabilities,
          currentNetWorth.netWorth,
          snapshotDate
        ]
      );
      return { ...currentNetWorth, date: snapshotDate, updated: true };
    } else {
      // Create new snapshot
      const result = await db.run(
        `INSERT INTO net_worth_history (date, total_assets, total_liabilities, net_worth)
         VALUES (?, ?, ?, ?)`,
        [
          snapshotDate,
          currentNetWorth.totalAssets,
          currentNetWorth.totalLiabilities,
          currentNetWorth.netWorth
        ]
      );
      return { ...currentNetWorth, date: snapshotDate, id: result.id, created: true };
    }
  }

  static async getNetWorthHistory(startDate = null, endDate = null, limit = null) {
    let query = 'SELECT * FROM net_worth_history';
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

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    return await db.all(query, params);
  }

  static async getNetWorthTrend(months = 12) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const history = await this.getNetWorthHistory(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    if (history.length < 2) {
      return { trend: 'insufficient_data', change: 0, changePercent: 0 };
    }

    const latest = history[0];
    const oldest = history[history.length - 1];
    
    const change = latest.net_worth - oldest.net_worth;
    const changePercent = oldest.net_worth !== 0 
      ? (change / Math.abs(oldest.net_worth)) * 100 
      : 0;

    return {
      trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
      change: change,
      changePercent: changePercent,
      period: {
        from: oldest.date,
        to: latest.date
      },
      dataPoints: history.length
    };
  }

  static async getMonthlyNetWorthSummary(year = new Date().getFullYear()) {
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
      
      // Get the latest snapshot for this month
      const snapshot = await db.get(
        `SELECT * FROM net_worth_history 
         WHERE date BETWEEN ? AND ? 
         ORDER BY date DESC 
         LIMIT 1`,
        [date, endDate]
      );

      monthlyData.push({
        month: month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        year: year,
        snapshot: snapshot || null,
        netWorth: snapshot ? snapshot.net_worth : null,
        totalAssets: snapshot ? snapshot.total_assets : null,
        totalLiabilities: snapshot ? snapshot.total_liabilities : null
      });
    }
    
    return monthlyData;
  }

  static async deleteNetWorthSnapshot(id) {
    const result = await db.run('DELETE FROM net_worth_history WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static async getNetWorthGoals() {
    // This could be expanded to include user-defined goals
    // For now, return some calculated milestones
    const current = await this.calculateCurrentNetWorth();
    const currentNetWorth = current.netWorth;
    
    const goals = [
      {
        name: 'Break Even',
        target: 0,
        achieved: currentNetWorth >= 0,
        remaining: currentNetWorth >= 0 ? 0 : Math.abs(currentNetWorth)
      },
      {
        name: 'First $10K',
        target: 10000,
        achieved: currentNetWorth >= 10000,
        remaining: currentNetWorth >= 10000 ? 0 : 10000 - currentNetWorth
      },
      {
        name: 'First $50K',
        target: 50000,
        achieved: currentNetWorth >= 50000,
        remaining: currentNetWorth >= 50000 ? 0 : 50000 - currentNetWorth
      },
      {
        name: 'First $100K',
        target: 100000,
        achieved: currentNetWorth >= 100000,
        remaining: currentNetWorth >= 100000 ? 0 : 100000 - currentNetWorth
      }
    ];

    return {
      currentNetWorth,
      goals,
      nextGoal: goals.find(goal => !goal.achieved) || null
    };
  }
}

module.exports = NetWorth;