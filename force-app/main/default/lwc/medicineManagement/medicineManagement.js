import { LightningElement, wire } from 'lwc';
import getMedicines from '@salesforce/apex/MedicineController.getMedicines';
export default class MedicineManagement extends LightningElement {
  searchKey=''; medicines=[];
  columns=[
    {label:'Medicine',fieldName:'Name'},
    {label:'Code',fieldName:'Code__c'},
    {label:'Unit Price',fieldName:'Unit_Price__c',type:'currency'},
    {label:'Stock',fieldName:'Stock_Quantity__c',type:'number'},
    {label:'Expiry',fieldName:'Expiry_Date__c',type:'date'},
    {label:'Active',fieldName:'Active__c',type:'boolean'}
  ];
  @wire(getMedicines,{searchKey:'$searchKey'}) wired({data}){if(data)this.medicines=data;}
  handleSearch(e){this.searchKey=e.target.value;}
}
