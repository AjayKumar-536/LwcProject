import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ConfigurableWelcome extends LightningElement {
    @api bannerTitle = 'Welcome to Salesforce';
    @api bannerMessage =
        'Configure this component using Lightning App Builder.';
    @api buttonLabel = 'Get Started';
    @api showButton = false;
    @api showIcon = false;

    showConfirmation = false;

    handleClick() {
        this.showConfirmation = true;

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Your configurable component is working!',
                variant: 'success'
            })
        );
    }
}
