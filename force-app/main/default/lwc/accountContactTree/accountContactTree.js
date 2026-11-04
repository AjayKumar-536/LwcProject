import { LightningElement } from 'lwc';
import getAccountsWithContacts
    from '@salesforce/apex/AccountContactTreeController.getAccountsWithContacts';

export default class AccountContactTree extends LightningElement {
    gridData = [];
    isLoading = true;
    errorMessage = '';

    columns = [
        {
            label: 'Name',
            fieldName: 'name',
            type: 'text',
            initialWidth: 280
        },
        {
            label: 'Phone',
            fieldName: 'phone',
            type: 'phone',
            initialWidth: 180
        },
        {
            label: 'Website',
            fieldName: 'website',
            type: 'url',
            typeAttributes: {
                target: '_blank'
            }
        }
    ];

    connectedCallback() {
        this.loadAccounts();
    }

    async loadAccounts() {
        this.isLoading = true;
        this.errorMessage = '';

        try {
            const data = await getAccountsWithContacts();

            this.gridData = data || [];
        } catch (error) {
            this.gridData = [];
            this.errorMessage = this.getErrorMessage(error);
        } finally {
            this.isLoading = false;
        }
    }

    get hasRecords() {
        return this.gridData.length > 0;
    }

    get showEmptyMessage() {
        return !this.isLoading &&
            !this.errorMessage &&
            this.gridData.length === 0;
    }

    getErrorMessage(error) {
        if (Array.isArray(error?.body)) {
            return error.body
                .map((item) => item.message)
                .join(', ');
        }

        return error?.body?.message ||
            error?.message ||
            'Unable to load Accounts and Contacts.';
    }
}
