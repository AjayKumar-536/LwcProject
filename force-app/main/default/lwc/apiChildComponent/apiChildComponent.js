import { LightningElement , api } from 'lwc';

export default class ApiChildComponent extends LightningElement {
    @api headerLabel = 'Hello Ajay';
}