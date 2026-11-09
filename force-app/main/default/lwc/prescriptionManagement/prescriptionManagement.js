import { LightningElement } from 'lwc';
import getPrescriptionItems from '@salesforce/apex/PrescriptionController.getPrescriptionItems';
export default class PrescriptionManagement extends LightningElement {
  medicalRecordId=''; items=[];
  columns=[
    {label:'Medicine',fieldName:'medicineName'},
    {label:'Quantity',fieldName:'Quantity__c',type:'number'},
    {label:'Dosage',fieldName:'Dosage__c'},
    {label:'Duration (days)',fieldName:'Duration__c',type:'number'}
  ];
  handleId(e){this.medicalRecordId=e.target.value;}
  async load(){
    const rows=await getPrescriptionItems({medicalRecordId:this.medicalRecordId});
    this.items=rows.map(r=>({...r,medicineName:r.Medicine__r?.Name}));
  }
}
