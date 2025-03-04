const totalIncomeElement = document.getElementById('total-income');
const totalExpensesElement = document.getElementById('total-expenses');
const totalSavingsElement = document.getElementById('total-savings');
const transactionListElement = document.getElementById('transaction-list');
const formElement = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const typeInput = document.getElementById('type');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');

let transactions = [];

// Load transactions from localStorage
function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions'));
    if (storedTransactions) {
        transactions = storedTransactions;
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '' || dateInput.value.trim() === '') {
        alert('Please fill in all fields');
        return;
    }

    const transaction = {
        id: generateID(),
        description: descriptionInput.value,
        type: typeInput.value,
        amount: +amountInput.value,
        date: dateInput.value
    };

    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateSummary();
    saveTransactions();

    descriptionInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transaction to DOM
function addTransactionToDOM(transaction) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${transaction.description}</td>
        <td>${transaction.type}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.date}</td>
        <td><button class="delete-btn" onclick="removeTransaction(${transaction.id})">Delete</button></td>
    `;
    transactionListElement.appendChild(row);
}

// Update summary
function updateSummary() {
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0)
        .toFixed(2);

    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0)
        .toFixed(2);

    const savings = (income - expenses).toFixed(2);

    totalIncomeElement.textContent = `$${income}`;
    totalExpensesElement.textContent = `$${expenses}`;
    totalSavingsElement.textContent = `$${savings}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    init();
}

// Initialize app
function init() {
    transactionListElement.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateSummary();
}

// Event listeners
formElement.addEventListener('submit', addTransaction);

// Load transactions and initialize app
loadTransactions();
init();