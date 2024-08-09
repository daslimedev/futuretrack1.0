module.exports = (sequelize, DataTypes) => {
  // Define the User model
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING, // STRING type for the username field
      allowNull: false, // Username cannot be null
      unique: true // Username must be unique in the database
    },
    email: {
      type: DataTypes.STRING, // STRING type for the email field
      allowNull: false, // Email cannot be null
      unique: true // Email must be unique in the database
    },
    password: {
      type: DataTypes.STRING, // STRING type for the password field
      allowNull: false // Password cannot be null
    }
  }, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: 'Users' // Explicitly sets the table name to 'Users'
  });

  // Associate the User model with the Transaction model
  User.associate = models => {
    // A user can have many transactions
    User.hasMany(models.Transaction, {
      foreignKey: 'UserId', // The foreign key in the Transactions table referencing the Users table
      as: 'transactions' // Alias for the association, accessed as `user.transactions`
    });
  };

  return User; // Return the User model to be used in other parts of the application
};
