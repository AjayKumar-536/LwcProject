import { LightningElement, api, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountClass.getAccounts';
import { MessageContext, publish } from 'lightning/messageService';
import accountChannel from '@salesforce/messageChannel/accountChannel__c';

export default class AccountChild2 extends LightningElement {
    @api searchTextChild2;

    @wire (MessageContext) messageContext;

    columns=[
        {label: 'Id', fieldName:'Id'},
        {label: 'Name', fieldName:'Name'},
        {label:'Actions', fieldName:'Actions', type:'button', typeAttributes:
        {
            label:'View Contacts',
            value:'view_contacts'
        }
    }
    ]

    //[] defines array
    //{} defines object

    rows=[
        {Id:'23', Name:'Ajay Kumar'},
        {Id:'30', Name:'Rajesh Sannu'},
        {Id:'33', Name:'Mahendra Botta'},
        {Id:'40', Name:'Vinay Kunda'}
    ]

    currentId;
    currentName;

    handleRowAction(event)
    {
        if(event.detail.action.value=='view_contacts')
        {
        this.currentId=event.detail.row.Id;
        this.currentName=event.detail.row.Name;

        const payload=
        {
            accountId: event.detail.row.Id,
            accountName: event.detail.row.Name
        };

        publish(this.messageContext, accountChannel ,payload);

        }
    }

    @wire(getAccounts, {searchTextClass:'$searchTextChild2'}) accountRecords;

}