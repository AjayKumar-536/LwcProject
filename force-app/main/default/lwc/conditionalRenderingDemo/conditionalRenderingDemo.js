import { LightningElement } from 'lwc';

export default class ConditionalRenderingDemo extends LightningElement {

    resultStatus = 'Pending';

    get isPass() {
        return this.resultStatus === 'Pass';
    }

    get isPending() {
        return this.resultStatus === 'Pending';
    }

    handlePass() {
        this.resultStatus = 'Pass';
    }

    handlePending() {
        this.resultStatus = 'Pending';
    }

    handleFail() {
        this.resultStatus = 'Fail';
    }
}