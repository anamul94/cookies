const { Sequelize } = require('sequelize');

// Load environment variables
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        // logging: console.log,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        // await sequelize.sync({ force: false });
        await sequelize.sync({ alter: true }); // Updates table schema if changes are made // Set 'force: true' to drop tables before recreating
        console.log('Tables created successfully!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;
