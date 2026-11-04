import { LightningElement } from 'lwc';

export default class DateValidation extends LightningElement {
    selectedDate = '';
    message = '';

    get today() {
        const now = new Date();
        const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 10);
    }

    handleDateChange(event) {
        this.selectedDate = event.target.value;
        this.message = '';
    }

    validateDate() {
        if (!this.selectedDate) {
            this.message = 'Please select a date.';
        } else if (this.selectedDate < this.today) {
            this.message = 'Past dates are not allowed.';
        } else {
            this.message = `Valid appointment date: ${this.selectedDate}`;
        }
    }
}