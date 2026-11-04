import { MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import dataChannel from '@salesforce/messageChannel/dataChannel__c';

export default class SubscriberComponent extends LightningElement {
    name='';
    subscription=null;
    @wire (MessageContext) messageContext;

    connectedCallback()
    {
        this.handleSubscribe();
    }

    disconnectedCallback()
    {
        this.handleUnsubscribe()
    }

    handleSubscribe()
    {
        if(!this.subscription)
        {
            this.subscription=subscribe(this.messageContext, dataChannel, 
                (parameter)=>
                {
                    this.name=parameter.name;
                }
                );
        }
    }

    handleUnsubscribe()
    {
        unsubscribe(this.subscription);
        this.subscription=null;
    }
}
