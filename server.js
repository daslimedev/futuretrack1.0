const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve the favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expensetracker.html'));
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Define User and Transaction models
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Transaction = sequelize.define('Transaction', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

// Define associations
User.hasMany(Transaction, { foreignKey: 'UserId' });
Transaction.belongsTo(User, { foreignKey: 'UserId' });

// Authenticate middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User Routes
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Transaction Routes
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { UserId: req.user.id },
            attributes: ['id', 'description', 'amount', 'type', 'date', 'createdAt', 'updatedAt'],
        });
        res.json(transactions);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
    const { description, amount, type, date } = req.body;

    try {
        const transaction = await Transaction.create({ description, amount, type, date, UserId: req.user.id });
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ message: 'Error adding transaction', error: error.message });
    }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        // Ensure the transaction belongs to the user before deleting
        if (transaction.UserId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this transaction' });
        }

        await transaction.destroy();
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
});

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced with models');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});
