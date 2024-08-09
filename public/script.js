document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const resetPasswordModal = document.getElementById('resetPasswordModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const showRegister = document.getElementById('showRegister');
    const showResetPassword = document.getElementById('showResetPassword');
    const transactionForm = document.getElementById('transactionForm');
    const totalBalance = document.getElementById('totalBalance');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpenses = document.getElementById('totalExpenses');
    const currentDate = document.getElementById('currentDate');
    const transactionList = document.getElementById('transactionList');
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const closeAlert = document.getElementById('closeAlert');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeText = document.getElementById('welcomeText');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    let transactions = [];
    let isLoggedIn = false;
    let currentUser = null;
    let expenseChart;

    // Functions
    async function fetchTransactions() {
        try {
            const response = await fetch('/api/transactions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                transactions = await response.json();
                updateUI();
            } else {
                showCustomAlert('Failed to fetch transactions.');
            }
        } catch (error) {
            showCustomAlert('An error occurred while fetching transactions.');
        }
    }

    async function addTransaction(e) {
        e.preventDefault();
        if (!isLoggedIn) {
            showCustomAlert('Please log in to add transactions.');
            return;
        }

        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const date = document.getElementById('transactionDate').value;

        if (!description || isNaN(amount) || !type || !date) {
            showCustomAlert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ description, amount, type, date })
            });

            if (response.ok) {
                showCustomAlert('Transaction added successfully!');
                fetchTransactions();
            } else {
                showCustomAlert('Failed to add transaction.');
            }
        } catch (error) {
            showCustomAlert('An error occurred while adding the transaction.');
        }
    }

    async function removeTransaction(id) {
        if (!isLoggedIn) {
            showCustomAlert('Please log in to remove transactions.');
            return;
        }

        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                showCustomAlert('Transaction removed successfully!');
                fetchTransactions();
            } else {
                showCustomAlert('Failed to remove transaction.');
            }
        } catch (error) {
            showCustomAlert('An error occurred while removing the transaction.');
        }
    }

    async function login(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                isLoggedIn = true;
                currentUser = username;
                closeAllModals();
                updateLoginStatus();
                fetchTransactions();
                showCustomAlert('Logged in successfully!');
            } else {
                showCustomAlert('Invalid username or password.');
            }
        } catch (error) {
            showCustomAlert('An error occurred during login.');
        }
    }

    async function register(e) {
        e.preventDefault();
        const username = document.getElementById('newUsername').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (password !== confirmPassword) {
            showCustomAlert('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                showCustomAlert('Registration successful! Please log in.');
                closeAllModals();
                loginModal.style.display = 'block';
            } else {
                showCustomAlert('Failed to register.');
            }
        } catch (error) {
            showCustomAlert('An error occurred during registration.');
        }
    }

    // Add event listeners for various UI interactions
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        isLoggedIn = false;
        currentUser = null;
        updateLoginStatus();
        showCustomAlert('Logged out successfully!');
        updateUI();
    });

    showRegister.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });

    showResetPassword.addEventListener('click', () => {
        loginModal.style.display = 'none';
        resetPasswordModal.style.display = 'block';
    });

    loginForm.addEventListener('submit', login);
    registerForm.addEventListener('submit', register);
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showCustomAlert('Password reset link sent to your email!');
        closeAllModals();
    });

    transactionForm.addEventListener('submit', addTransaction);

    closeAlert.addEventListener('click', () => {
        customAlert.classList.add('hidden');
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];

    function showCustomAlert(message) {
        alertMessage.textContent = message;
        customAlert.classList.remove('hidden');
        setTimeout(() => {
            customAlert.classList.add('hidden');
        }, 3000);
    }

    function updateLoginStatus() {
        if (isLoggedIn) {
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            welcomeMessage.classList.remove('hidden');
            welcomeText.innerHTML = `Welcome back, ${currentUser} 👋`;
        } else {
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            welcomeMessage.classList.add('hidden');
        }
    }

    function closeAllModals() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        resetPasswordModal.style.display = 'none';
    }

    function updateUI() {
        const { balance, income, expenses } = calculateTotals();
        totalBalance.textContent = `KES ${balance.toFixed(2)}`;
        totalIncome.textContent = `KES ${income.toFixed(2)}`;
        totalExpenses.textContent = `KES ${expenses.toFixed(2)}`;
        currentDate.textContent = new Date().toLocaleDateString();
        renderTransactionList();
        updateExpenseChart();
    }

    function calculateTotals() {
        let income = 0;
        let expenses = 0;
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else {
                expenses += transaction.amount;
            }
        });
        return { balance: income - expenses, income, expenses };
    }

    function renderTransactionList() {
        transactionList.innerHTML = '';
        transactions.forEach((transaction) => {
            const li = document.createElement('li');
            li.classList.add('transaction-item', transaction.type, 'fade-in');
            li.innerHTML = `
                <span>${transaction.description}</span>
                <span>KES ${transaction.amount.toFixed(2)}</span>
                <span>${transaction.date}</span>
                <button class="remove-btn" data-id="${transaction.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            transactionList.appendChild(li);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                removeTransaction(id);
            });
        });
    }

    function updateExpenseChart() {
        if (expenseChart) {
            expenseChart.destroy();
        }

        expenseChart = new Chart(ctx, {
            type: 'bar', 
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    label: 'Amount (KES)',
                    data: [calculateTotals().income, calculateTotals().expenses],
                    backgroundColor: ['green', 'purple']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initial Fetch
    if (localStorage.getItem('token')) {
        isLoggedIn = true;
        updateLoginStatus();
        fetchTransactions();
    }
});
