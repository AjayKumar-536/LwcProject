import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CustomerFollowUpAction extends LightningElement {
    @api recordId;

    customerName = '';
    followUpType = 'Call';
    notes = '';

    followUpOptions = [
        { label: 'Phone Call', value: 'Call' },
        { label: 'Email', value: 'Email' },
        { label: 'Meeting', value: 'Meeting' },
        { label: 'Other', value: 'Other' }
    ];

    handleNameChange(event) {
        this.customerName = event.detail.value;
    }

    handleTypeChange(event) {
        this.followUpType = event.detail.value;
    }

    handleNotesChange(event) {
        this.notes = event.detail.value;
    }

    handleSubmit() {
        const fields = [
            ...this.template.querySelectorAll(
                'lightning-input, lightning-combobox, lightning-textarea'
            )
        ];

        const isValid = fields.reduce((valid, field) => {
            field.reportValidity();
            return field.checkValidity() && valid;
        }, true);

        if (!isValid) {
            return;
        }

        // Practice demo only: this does not save a Salesforce record.
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: `Follow-up prepared for ${this.customerName}.`,
                variant: 'success'
            })
        );

        this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
