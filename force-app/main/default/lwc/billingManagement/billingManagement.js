import { LightningElement, wire } from 'lwc';
import getBills from '@salesforce/apex/BillingController.getBills';
export default class BillingManagement extends LightningElement {
  bills=[];
  columns=[
    {label:'Bill Number',fieldName:'Name'},
    {label:'Patient',fieldName:'patientName'},
    {label:'Bill Date',fieldName:'Bill_Date__c',type:'date'},
    {label:'Amount',fieldName:'Amount__c',type:'currency'},
    {label:'Payment Status',fieldName:'Payment_Status__c'}
  ];
  @wire(getBills) wired({data}){if(data)this.bills=data.map(b=>({...b,patientName:b.Patient__r?.Name}));}
}
