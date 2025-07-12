const db = require('../models/database');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
  try {
    console.log('Loading sample data...');
    
    const seedPath = path.join(__dirname, '../../database/seeds/sample_data.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    
    // Split SQL statements and execute them
    const statements = seedData.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.run(statement.trim());
      }
    }
    
    console.log('Sample data loaded successfully!');
  } catch (error) {
    console.error('Error loading sample data:', error.message);
  }
}

// Allow running this script directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seeding complete');
    process.exit(0);
  }).catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase };