# futuretrack1.0
Expense Tracker Web Application Documentation
Project Overview
The FutureTrack Web Application is a full-stack solution designed to help users manage their personal finances by tracking their income and expenses. The application supports user registration, authentication, and transaction management. Each user can manage their transactions securely, and the system ensures that transactions are specific to each user.

Features
User Registration: Create a new user account with a unique username and email.
User Authentication: Log in to the application with a username and password.
Transaction Management: Add, view, and delete transactions with details like description, amount, type (income/expense), and date.
User-Specific Data: Each user's transactions are private and accessible only to them.
Secure Access: Transactions and user data are protected through JWT authentication.
File Structure
public/: Contains static files served by the application.
favicon.ico: The favicon for the application.
expensetracker.html: The main HTML file for the front end of the application.
server.js: The main server file that initializes and configures the Express server, defines routes, and manages database operations.
models/: Contains Sequelize model definitions.
User.js: Defines the User model.
Transaction.js: Defines the Transaction model.
.env: Environment configuration file for sensitive information like database credentials and JWT secret.
package.json: Contains project metadata and dependencies.
README.md: This documentation file.
Dependencies
The project relies on several npm packages:

express: A fast, minimalist web framework for Node.js.
path: Provides utilities for working with file and directory paths.
body-parser: Middleware to parse incoming request bodies.
jsonwebtoken: For generating and verifying JSON Web Tokens (JWTs).
bcrypt: Library for hashing passwords.
sequelize: An ORM (Object-Relational Mapper) for Node.js that supports various SQL databases.
mysql2: MySQL database driver for Sequelize.
cors: Middleware for enabling Cross-Origin Resource Sharing.
dotenv: Loads environment variables from a .env file.
serve-favicon: Middleware for serving a favicon.

Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL
ORM: Sequelize
Authentication: JWT (JSON Web Tokens), bcrypt for password hashing
Other: CORS, dotenv for environment variables, serve-favicon for favicon handling

UI Design
The user interface of FutureTrack is inspired by a galaxy theme, providing a unique and engaging experience for users. The design includes:

Celestial Backgrounds: Visually stunning backgrounds that give the app a space-themed appearance.
Futuristic Elements: Modern and sleek design elements that enhance the user experience.
Smooth Animations: Fluid transitions and animations to make navigation enjoyable.



Installation and Setup
Clone the repository:

bash
Copy code
git clone https://github.com/daslimedev/futuretrack1.0.git 
cd futuretrack
Install dependencies:

bash
Copy code
npm install
Create a .env file in the api directory with the following variables:

env
Copy code
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=127.0.0.1
SECRET_KEY=your_jwt_secret_key
Start the server:

bash
Copy code
npm start
Access the app at http://localhost:3000.

Code Structure
Server Initialization:
The server is initialized with Express and configured to serve static files, handle CORS, and parse request bodies. It also sets up routes for user and transaction management.

Models:

User: Represents the users of the application, with fields for username, email, and hashed password.
Transaction: Represents financial transactions, with fields for description, amount, type, date, and a foreign key reference to the user.
Routes:

POST /api/register: Registers a new user.
POST /api/login: Logs in an existing user and issues a JWT.
GET /api/transactions: Retrieves all transactions for the authenticated user.
POST /api/transactions: Creates a new transaction for the authenticated user.
DELETE /api/transactions/:id: Deletes a specific transaction belonging to the authenticated user.
Authentication Middleware:
authenticateToken: Ensures that routes requiring authentication are protected and only accessible with a valid JWT.

Usage
Register a New User:
Send a POST request to /api/register with a JSON body containing username, email, and password.

Log In:
Send a POST request to /api/login with username and password. The response will include a JWT used for authenticating subsequent requests.

Manage Transactions:

Get Transactions: Send a GET request to /api/transactions with the JWT in the Authorization header.
Add Transaction: Send a POST request to /api/transactions with details of the transaction (description, amount, type, date) and the JWT.
Delete Transaction: Send a DELETE request to /api/transactions/:id with the JWT and the transaction ID in the URL.
Benefits
Secure: Uses JWT for secure authentication and bcrypt for password hashing.
User-Specific: Ensures that each user can only access their own transactions.
Scalable: Built with Sequelize ORM for easy database management and scalability.
User-Friendly: Provides a simple and intuitive interface for managing personal finances.
Future Enhancements
Advanced Reporting: Implement features for generating financial reports and charts.
Enhanced Security: Add more security features like password reset and account verification.
Improved UI/UX: Enhance the user interface for better usability and aesthetics.

Credits
This project is designed and developed by Surge Brian Mutugi. Special thanks to Surge for the innovative galaxy-inspired UI design.

Instagram: tushizzlegrm
Facebook: sb daslime
