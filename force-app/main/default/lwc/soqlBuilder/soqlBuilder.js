import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SoqlBuilder extends LightningElement {
    selectedObject = 'Account';

    selectedFields = ['Id', 'Name', 'Phone', 'Website'];

    recordLimit = 50;

    generatedQuery = '';

    objectOptions = [
        { label: 'Account', value: 'Account' },
        { label: 'Contact', value: 'Contact' }
    ];

    get fieldOptions() {
        if (this.selectedObject === 'Account') {
            return [
                { label: 'Account ID', value: 'Id' },
                { label: 'Account Name', value: 'Name' },
                { label: 'Phone', value: 'Phone' },
                { label: 'Website', value: 'Website' },
                { label: 'Billing City', value: 'BillingCity' },
                { label: 'Industry', value: 'Industry' }
            ];
        }

        return [
            { label: 'Contact ID', value: 'Id' },
            { label: 'First Name', value: 'FirstName' },
            { label: 'Last Name', value: 'LastName' },
            { label: 'Email', value: 'Email' },
            { label: 'Phone', value: 'Phone' },
            { label: 'Account ID', value: 'AccountId' }
        ];
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;

        this.selectedFields =
            this.selectedObject === 'Account'
                ? ['Id', 'Name', 'Phone', 'Website']
                : ['Id', 'FirstName', 'LastName', 'Email'];

        this.generatedQuery = '';
    }

    handleFieldsChange(event) {
        this.selectedFields = event.detail.value;
        this.generatedQuery = '';
    }

    handleLimitChange(event) {
        this.recordLimit = event.detail.value;
        this.generatedQuery = '';
    }

    handleGenerate() {
        const limit = Number(this.recordLimit);

        if (!this.selectedFields.length) {
            this.showToast(
                'Missing Fields',
                'Select at least one field.',
                'warning'
            );
            return;
        }

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 2000
        ) {
            this.showToast(
                'Invalid Limit',
                'Enter a whole number between 1 and 2000.',
                'error'
            );
            return;
        }

        this.generatedQuery =
            `SELECT ${this.selectedFields.join(', ')}\n` +
            `FROM ${this.selectedObject}\n` +
            `LIMIT ${limit}`;

        this.showToast(
            'Query Generated',
            'Your SOQL query is ready.',
            'success'
        );
    }

    handleReset() {
        this.selectedObject = 'Account';
        this.selectedFields = ['Id', 'Name', 'Phone', 'Website'];
        this.recordLimit = 50;
        this.generatedQuery = '';
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
