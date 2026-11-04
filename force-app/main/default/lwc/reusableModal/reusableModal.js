import { LightningElement, api } from 'lwc';

export default class ReusableModal extends LightningElement {
    @api titleText = 'Information';
    @api messageText = 'Modal content goes here.';
    handleClose() {
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }
}