import { LightningElement } from 'lwc';

const COLUMNS = [
    { label: 'Employee ID', fieldName: 'id' },
    { label: 'Name', fieldName: 'name' },
    { label: 'Department', fieldName: 'department' },
    { label: 'City', fieldName: 'city' },
    {
        label: 'Salary',
        fieldName: 'salary',
        type: 'currency',
        typeAttributes: {
            currencyCode: 'INR',
            maximumFractionDigits: 0
        }
    }
];

const EMPLOYEES = [
    { id: 'E001', name: 'Ajay', department: 'IT', city: 'Nellore', salary: 35000 },
    { id: 'E002', name: 'Mahendra', department: 'CSE', city: 'Kavali', salary: 42000 },
    { id: 'E003', name: 'Rajesh', department: 'IT', city: 'Hyderabad', salary: 45000 },
    { id: 'E004', name: 'Dinesh', department: 'CD', city: 'Guntur', salary: 38000 },
    { id: 'E005', name: 'Vishnu', department: 'CSE', city: 'Vizag', salary: 40000 },
    { id: 'E006', name: 'Naveen', department: 'IT', city: 'Nellore', salary: 50000 },
    { id: 'E007', name: 'Harish', department: 'CD', city: 'Kavali', salary: 32000 },
    { id: 'E008', name: 'Chetan', department: 'CSE', city: 'Hyderabad', salary: 48000 },
    { id: 'E009', name: 'Praveen', department: 'IT', city: 'Guntur', salary: 37000 },
    { id: 'E010', name: 'Narendra', department: 'CD', city: 'Vizag', salary: 41000 },
    { id: 'E011', name: 'Meghana', department: 'IT', city: 'Nellore', salary: 46000 },
    { id: 'E012', name: 'Lakshmi', department: 'CSE', city: 'Vizag', salary: 44000 }
];

export default class EmployeePagination extends LightningElement {
    columns = COLUMNS;
    employees = EMPLOYEES;
    currentPage = 1;
    pageSize = 5;

    get totalRecords() {
        return this.employees.length;
    }

    get totalPages() {
        return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }

    get visibleRecords() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        return this.employees.slice(startIndex, endIndex);
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage >= this.totalPages;
    }

    handleFirst() {
        this.currentPage = 1;
    }

    handlePrevious() {
        if (!this.isFirstPage) {
            this.currentPage -= 1;
        }
    }

    handleNext() {
        if (!this.isLastPage) {
            this.currentPage += 1;
        }
    }

    handleLast() {
        this.currentPage = this.totalPages;
    }
}
