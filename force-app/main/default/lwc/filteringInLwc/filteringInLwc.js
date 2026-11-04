import { LightningElement } from 'lwc';

export default class Filtering extends LightningElement {
    searchKey = '';
    students = [
        { id: 1, name: 'Ajay', department: 'IT' },
        { id: 2, name: 'Mahendra', department: 'CSE' },
        { id: 3, name: 'Rajesh', department: 'IT' },
        { id: 4, name: 'Dinesh', department: 'CD' }
    ];

    handleSearch(event) {
        this.searchKey = event.target.value;
    }

    get filteredStudents() {
        const key = this.searchKey.trim().toLowerCase();
        return this.students.filter(student =>
            student.name.toLowerCase().includes(key) ||
            student.department.toLowerCase().includes(key)
        );
    }

    get hasResults() {
        return this.filteredStudents.length > 0;
    }
}