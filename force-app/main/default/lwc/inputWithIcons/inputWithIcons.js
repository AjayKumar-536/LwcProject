import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class InputWithIcons extends LightningElement {
    searchKey = '';
    email = '';
    password = '';
    joiningDate = '';

    showMessage = false;
    successMessage = '';

    employees = [
        { id: 1, name: 'Ajay Kumar', department: 'IT' },
        { id: 2, name: 'Vishnu', department: 'CSE' },
        { id: 3, name: 'Dinesh', department: 'IT' },
        { id: 4, name: 'Rajesh', department: 'HR' },
        { id: 5, name: 'Mahendra', department: 'Finance' },
        { id: 6, name: 'Naveen', department: 'CSE' }
    ];

    get filteredEmployees() {
        const search = this.searchKey.trim().toLowerCase();

        if (!search) {
            return this.employees;
        }

        return this.employees.filter((employee) =>
            employee.name.toLowerCase().includes(search) ||
            employee.department.toLowerCase().includes(search)
        );
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
        this.showMessage = false;
    }

    handlePasswordChange(event) {
        this.password = event.target.value;
        this.showMessage = false;
    }

    handleDateChange(event) {
        this.joiningDate = event.target.value;
        this.showMessage = false;
    }

    handleSubmit() {
        const inputs = [
            ...this.template.querySelectorAll('lightning-input')
        ];

        const isValid = inputs.reduce((valid, input) => {
            input.reportValidity();
            return input.checkValidity() && valid;
        }, true);

        if (!isValid) {
            this.showMessage = false;
            return;
        }

        this.successMessage =
            `Form validated for ${this.email}. Joining date: ${this.joiningDate}.`;

        this.showMessage = true;

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'All required fields are valid.',
                variant: 'success'
            })
        );

        // Practice only: no data is saved to Salesforce.
        // Do not store or transmit the password.
    }

    handleClear() {
        this.searchKey = '';
        this.email = '';
        this.password = '';
        this.joiningDate = '';
        this.showMessage = false;
        this.successMessage = '';

        this.template.querySelectorAll('lightning-input')
            .forEach((input) => {
                input.value = '';
            });
    }
}
