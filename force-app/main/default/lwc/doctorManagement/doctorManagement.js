import { LightningElement, wire } from 'lwc';
import getDoctors from '@salesforce/apex/DoctorController.getDoctors';
export default class DoctorManagement extends LightningElement {
  searchKey=''; doctors=[];
  columns=[
    {label:'Doctor',fieldName:'Name'},
    {label:'Specialization',fieldName:'Specialization__c'},
    {label:'Phone',fieldName:'Phone__c',type:'phone'},
    {label:'Email',fieldName:'Email__c',type:'email'},
    {label:'Fee',fieldName:'Fee__c',type:'currency'},
    {label:'Active',fieldName:'Active__c',type:'boolean'}
  ];
  @wire(getDoctors,{searchKey:'$searchKey'}) wired({data,error}) {
    if(data)this.doctors=data;
    if(error)this.doctors=[];
  }
  handleSearch(e){this.searchKey=e.target.value;}
}
