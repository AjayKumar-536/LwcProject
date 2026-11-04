import { LightningElement } from 'lwc';

const INITIAL_DATA = [
    { id: 1, name: 'Rajesh', score: 82 },
    { id: 2, name: 'Ajay', score: 95 },
    { id: 3, name: 'Mahendra', score: 68 },
    { id: 4, name: 'Dinesh', score: 88 }
];

export default class Sorting extends LightningElement {
    students = INITIAL_DATA.map(item => ({ ...item }));

    sortAscending() {
        this.students = [...this.students].sort((a, b) => a.name.localeCompare(b.name));
    }

    sortDescending() {
        this.students = [...this.students].sort((a, b) => b.name.localeCompare(a.name));
    }
}