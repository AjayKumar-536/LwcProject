
import { LightningElement, wire } from 'lwc';

import filterAccountTypeType
    from '@salesforce/apex/AccountController.filterAccountTypeType';

export default class WireApexWithParams extends LightningElement {

    selectedType = '';

    accounts = [];
    error;

    @wire(filterAccountTypeType, { type: '$selectedType' })
    wiredAccounts({ data, error }) {

        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.accounts = [];
            this.error = error;
        }
    }

    get typeOptions() {
        return [
            {
                label: 'Customer - Channel',
                value: 'Customer - Channel'
            },
            {
                label: 'Customer - Direct',
                value: 'Customer - Direct'
            }
        ];
    }

    get hasAccounts() {
        return this.accounts.length > 0;
    }

    typeHandler(event) {
        this.selectedType = event.detail.value;
    }
}
