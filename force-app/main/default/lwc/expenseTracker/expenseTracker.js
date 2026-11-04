
import { LightningElement } from 'lwc';

const STORAGE_KEY = 'smartExpenseTrackerData';
const BUDGET_KEY = 'smartExpenseTrackerBudget';

const CATEGORIES = [
    { label: 'Food', value: 'Food', icon: '🍔' },
    { label: 'Travel', value: 'Travel', icon: '🚗' },
    { label: 'Shopping', value: 'Shopping', icon: '🛍️' },
    { label: 'Bills', value: 'Bills', icon: '💡' },
    { label: 'Health', value: 'Health', icon: '💊' },
    { label: 'Education', value: 'Education', icon: '📚' },
    { label: 'Other', value: 'Other', icon: '📌' }
];

function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function readStorage(key, fallback) {
    try {
        const saved = window.localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
    } catch (error) {
        return fallback;
    }
}

export default class ExpenseTracker extends LightningElement {
    expenses = [];
    budget = 20000;

    expenseName = '';
    expenseAmount = '';
    expenseCategory = 'Food';
    expenseDate = getToday();
    budgetInput = '20000';

    searchTerm = '';
    filterCategory = 'All';
    formMessage = '';

    categoryOptions = CATEGORIES.map((item) => ({
        label: item.label,
        value: item.value
    }));

    connectedCallback() {
        const savedExpenses = readStorage(STORAGE_KEY, []);
        const savedBudget = readStorage(BUDGET_KEY, 20000);

        if (Array.isArray(savedExpenses)) {
            this.expenses = savedExpenses
                .filter((item) =>
                    item &&
                    typeof item.name === 'string' &&
                    Number.isFinite(Number(item.amount)) &&
                    Number(item.amount) > 0 &&
                    CATEGORIES.some((cat) => cat.value === item.category) &&
                    typeof item.date === 'string'
                )
                .map((item) => ({
                    ...item,
                    amount: Number(item.amount)
                }));
        }

        if (
            Number.isFinite(Number(savedBudget)) &&
            Number(savedBudget) >= 0
        ) {
            this.budget = Number(savedBudget);
            this.budgetInput = String(this.budget);
        }
    }

    get formattedTotal() {
        return this.formatCurrency(this.totalExpenses);
    }

    get formattedBudget() {
        return this.formatCurrency(this.budget);
    }

    get formattedRemaining() {
        return this.formatCurrency(this.budget - this.monthlyExpenses);
    }

    get totalExpenses() {
        return this.expenses.reduce(
            (total, item) => total + Number(item.amount),
            0
        );
    }

    get monthlyExpenses() {
        const currentMonth = getToday().slice(0, 7);

        return this.expenses
            .filter((item) => item.date.slice(0, 7) === currentMonth)
            .reduce((total, item) => total + Number(item.amount), 0);
    }

    get budgetMessage() {
        if (this.budget === 0) {
            return 'Set a budget above ₹0 to track progress.';
        }

        if (this.monthlyExpenses > this.budget) {
            return `Over budget by ${this.formatCurrency(
                this.monthlyExpenses - this.budget
            )}`;
        }

        return `${Math.min(
            100,
            Math.round((this.monthlyExpenses / this.budget) * 100)
        )}% of monthly budget used`;
    }

    get progressStyle() {
        const percentage = this.budget > 0
            ? Math.min(100, (this.monthlyExpenses / this.budget) * 100)
            : 0;

        return `width: ${percentage}%;`;
    }

    get transactionCount() {
        return this.expenses.length;
    }

    get filteredExpenses() {
        const search = this.searchTerm.trim().toLowerCase();

        return this.expenses
            .filter((item) => {
                const matchesSearch =
                    item.name.toLowerCase().includes(search) ||
                    item.category.toLowerCase().includes(search);

                const matchesCategory =
                    this.filterCategory === 'All' ||
                    item.category === this.filterCategory;

                return matchesSearch && matchesCategory;
            })
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((item) => {
                const category = CATEGORIES.find(
                    (cat) => cat.value === item.category
                );

                return {
                    ...item,
                    formattedAmount: this.formatCurrency(item.amount),
                    icon: category ? category.icon : '📌',
                    iconClass: `expense-icon icon-${item.category.toLowerCase()}`
                };
            });
    }

    get hasTransactions() {
        return this.filteredExpenses.length > 0;
    }

    get categorySpending() {
        const totals = {};

        this.expenses.forEach((item) => {
            totals[item.category] =
                (totals[item.category] || 0) + Number(item.amount);
        });

        const grandTotal = this.totalExpenses;

        return Object.keys(totals)
            .map((name) => ({
                name,
                amount: totals[name],
                formattedAmount: this.formatCurrency(totals[name]),
                percent: grandTotal > 0
                    ? Math.round((totals[name] / grandTotal) * 100)
                    : 0,
                barStyle: `width: ${
                    grandTotal > 0
                        ? (totals[name] / grandTotal) * 100
                        : 0
                }%;`
            }))
            .sort((a, b) => b.amount - a.amount);
    }

    get hasCategorySpending() {
        return this.categorySpending.length > 0;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(Number(amount) || 0);
    }

    handleNameChange(event) {
        this.expenseName = event.target.value;
        this.formMessage = '';
    }

    handleAmountChange(event) {
        this.expenseAmount = event.target.value;
        this.formMessage = '';
    }

    handleCategoryChange(event) {
        this.expenseCategory = event.target.value;
    }

    handleDateChange(event) {
        this.expenseDate = event.target.value;
    }

    handleBudgetChange(event) {
        this.budgetInput = event.target.value;
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value;
    }

    handleFilterChange(event) {
        this.filterCategory = event.target.value;
    }

    handleSubmit(event) {
        event.preventDefault();

        const name = this.expenseName.trim();
        const amount = Number(this.expenseAmount);
        const budget = Number(this.budgetInput);

        if (!name) {
            this.formMessage = 'Please enter an expense name.';
            return;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            this.formMessage = 'Enter an amount greater than zero.';
            return;
        }

        if (!Number.isFinite(budget) || budget < 0) {
            this.formMessage = 'Enter a valid budget of zero or more.';
            return;
        }

        if (!this.expenseDate || this.expenseDate > getToday()) {
            this.formMessage = 'Choose a valid date that is not in the future.';
            return;
        }

        const newExpense = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name,
            amount,
            category: this.expenseCategory,
            date: this.expenseDate
        };

        this.expenses = [newExpense, ...this.expenses];
        this.budget = budget;

        this.saveExpenses();
        this.saveBudget();

        this.expenseName = '';
        this.expenseAmount = '';
        this.expenseCategory = 'Food';
        this.expenseDate = getToday();
        this.formMessage = 'Expense added successfully!';
    }

    handleDelete(event) {
        const expenseId = event.currentTarget.dataset.id;

        this.expenses = this.expenses.filter(
            (item) => item.id !== expenseId
        );

        this.saveExpenses();
    }

    handleClear() {
        if (this.expenses.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete all expenses?'
        );

        if (!confirmed) {
            return;
        }

        this.expenses = [];
        this.saveExpenses();
    }

    saveExpenses() {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(this.expenses)
            );
        } catch (error) {
            this.formMessage =
                'Unable to save expenses in browser storage.';
        }
    }

    saveBudget() {
        try {
            window.localStorage.setItem(
                BUDGET_KEY,
                JSON.stringify(this.budget)
            );
        } catch (error) {
            this.formMessage =
                'Budget updated, but browser storage could not save it.';
        }
    }
}
