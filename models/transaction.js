const { DataTypes } = require('sequelize'); // Import DataTypes from Sequelize to define model attributes
const sequelize = require('./index').sequelize; // Import the Sequelize instance from your index.js file

// Define the Transaction model
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER, // INTEGER type for the ID field
    autoIncrement: true, // Automatically increment ID value
    primaryKey: true, // Set ID as the primary key
  },
  description: {
    type: DataTypes.STRING, // STRING type for the description of the transaction
    allowNull: false, // Description cannot be null
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), // DECIMAL type with 10 digits total and 2 decimal places for the amount
    allowNull: false, // Amount cannot be null
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'), // ENUM type with possible values 'income' or 'expense'
    allowNull: false, // Type cannot be null
  },
  date: {
    type: DataTypes.DATEONLY, // DATEONLY type for storing only the date (no time)
    allowNull: false, // Date cannot be null
  },
  createdAt: {
    type: DataTypes.DATE, // DATE type for when the transaction was created
    allowNull: false, // Creation date cannot be null
    defaultValue: DataTypes.NOW, // Default value is the current date and time
  },
  updatedAt: {
    type: DataTypes.DATE, // DATE type for when the transaction was last updated
    allowNull: false, // Updated date cannot be null
    defaultValue: DataTypes.NOW, // Default value is the current date and time
    onUpdate: DataTypes.NOW, // Automatically update this field when the record is updated
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Associate the Transaction model with the User model
Transaction.associate = function(models) {
  // A transaction belongs to a user
  Transaction.belongsTo(models.User, {
    foreignKey: 'UserId', // The foreign key in the Transactions table referencing the Users table
    as: 'user', // Alias for the association
  });
};

module.exports = Transaction; // Export the Transaction model so it can be used in other parts of the application
