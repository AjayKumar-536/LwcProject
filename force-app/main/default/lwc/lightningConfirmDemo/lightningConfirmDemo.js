import { LightningElement } from 'lwc';
import LightningConfirm from 'lightning/confirm';

export default class LightningConfirmDemo extends LightningElement {

    statusMessage = 'No action performed yet.';

    async handleDelete() {
        const result = await LightningConfirm.open({
            label: 'Confirm Deletion',
            message: 'Are you sure you want to delete this student?',
            variant: 'header',
            theme: 'warning'
        });

        if (result) {
            this.statusMessage = 'Student deletion confirmed.';
        } else {
            this.statusMessage = 'Student deletion cancelled.';
        }
    }

    async handleReset() {
        const result = await LightningConfirm.open({
            label: 'Reset Form',
            message: 'Are you sure you want to reset the form?',
            variant: 'header',
            theme: 'warning'
        });

        if (result) {
            this.statusMessage = 'Form reset confirmed.';
        } else {
            this.statusMessage = 'Form reset cancelled.';
        }
    }

    async handleCancel() {
        const result = await LightningConfirm.open({
            label: 'Confirm Action',
            message: 'Do you want to continue this operation?',
            variant: 'headerless'
        });

        if (result) {
            this.statusMessage = 'Operation confirmed.';
        } else {
            this.statusMessage = 'Operation cancelled.';
        }
    }
}