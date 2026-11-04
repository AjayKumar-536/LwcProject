import { LightningElement } from 'lwc';
import LightningAlert from 'lightning/alert';

export default class LightningAlertExplain extends LightningElement {

    async handleSuccess() {
        await LightningAlert.open({
            label: 'Success!',
            message: 'Your student details were saved successfully.',
            theme: 'success'
        });

        console.log('Success alert closed');
    }

    async handleError() {
        await LightningAlert.open({
            label: 'Error!',
            message: 'Unable to save the student details.',
            theme: 'error'
        });

        console.log('Error alert closed');
    }

    async handleWarning() {
        await LightningAlert.open({
            label: 'Warning!',
            message: 'Please check the student details before continuing.',
            theme: 'warning'
        });

        console.log('Warning alert closed');
    }

    async handleInfo() {
        await LightningAlert.open({
            label: 'Information',
            message: 'Please complete all required fields.',
            theme: 'info'
        });

        console.log('Information alert closed');
    }
}