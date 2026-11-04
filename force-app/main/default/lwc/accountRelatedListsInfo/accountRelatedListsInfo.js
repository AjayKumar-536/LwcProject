import { LightningElement, wire } from 'lwc';
import { getRelatedListsInfo } from 'lightning/uiRelatedListApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

export default class AccountRelatedListsInfo extends LightningElement {
    relatedLists = [];
    error;
    isLoading = true;

    @wire(getRelatedListsInfo, {
        parentObjectApiName: ACCOUNT_OBJECT.objectApiName
    })
    wiredRelatedLists({ data, error }) {
        this.isLoading = false;

        if (data) {
            this.relatedLists = data.relatedLists || [];
            this.error = undefined;
        } else if (error) {
            this.relatedLists = [];
            this.error = error;
        }
    }

    get hasRelatedLists() {
        return this.relatedLists.length > 0;
    }

    get errorMessage() {
        return this.error?.body?.message
            || 'Unable to retrieve related lists.';
    }
}
