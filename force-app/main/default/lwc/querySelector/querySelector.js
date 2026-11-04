import { LightningElement } from 'lwc';

export default class WireExample2 extends LightningElement {

    name='Ajay';

    handleClick(event)
    {
        this.name=this.template.querySelector('lightning-input.querySelector').value;
    }
}


