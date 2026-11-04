import { LightningElement, wire } from 'lwc';
import getEmployees from
    '@salesforce/apex/EmployeeController.getEmployees';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const ACTIONS = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' }
];

const COLUMNS = [
    {
        label: 'Employee Number',
        fieldName: 'Employee_Number__c',
        type: 'text'
    },
    {
        label: 'Employee Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Email',
        fieldName: 'Email__c',
        type: 'email'
    },
    {
        label: 'Department',
        fieldName: 'Department__c',
        type: 'text'
    },
    {
        type: 'action',
        typeAttributes: { rowActions: ACTIONS }
    }
];

export default class EmployeeManagement extends LightningElement {
    employees = [];
    columns = COLUMNS;

    isLoading = true;
    showModal = false;
    isViewMode = false;
    selectedEmployeeId;
    modalTitle = 'Add Employee';

    wiredEmployeeResult;

    @wire(getEmployees)
    wiredEmployees(result) {
        this.wiredEmployeeResult = result;

        if (result.data) {
            this.employees = result.data;
            this.isLoading = false;
        } else if (result.error) {
            this.employees = [];
            this.isLoading = false;
            this.showToast(
                'Error',
                'Unable to load employee records.',
                'error'
            );
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        this.selectedEmployeeId = row.Id;
        this.showModal = true;

        if (actionName === 'view') {
            this.isViewMode = true;
            this.modalTitle = 'Employee Details';
        } else if (actionName === 'edit') {
            this.isViewMode = false;
            this.modalTitle = 'Edit Employee';
        }
    }

    handleNewEmployee() {
        this.selectedEmployeeId = undefined;
        this.isViewMode = false;
        this.modalTitle = 'Add Employee';
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.selectedEmployeeId = undefined;
    }

    async handleSuccess() {
        this.showToast(
            'Success',
            'Employee record saved successfully.',
            'success'
        );

        this.closeModal();

        try {
            await refreshApex(this.wiredEmployeeResult);
        } catch (error) {
            this.showToast(
                'Refresh Error',
                'Saved successfully, but the list could not refresh.',
                'warning'
            );
        }
    }

    handleError() {
        this.showToast(
            'Error',
            'Unable to save the employee record. Check the form fields.',
            'error'
        );
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}

