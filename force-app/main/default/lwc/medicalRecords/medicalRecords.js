import { LightningElement } from 'lwc';
import getRecords from '@salesforce/apex/MedicalRecordController.getRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class MedicalRecords extends LightningElement {
  patientId=''; records=[];
  columns=[
    {label:'Record',fieldName:'Name'},
    {label:'Doctor',fieldName:'doctorName'},
    {label:'Diagnosis',fieldName:'Diagnosis__c'},
    {label:'Prescription Date',fieldName:'Prescription_Date__c',type:'date'}
  ];
  handlePatientId(e){this.patientId=e.target.value;}
  async load(){
    try {
      const data=await getRecords({patientId:this.patientId});
      this.records=data.map(r=>({...r,doctorName:r.Doctor__r?.Name}));
    } catch(e) {
      this.dispatchEvent(new ShowToastEvent({title:'Error',message:e.body?.message || 'Unable to load records.',variant:'error'}));
    }
  }
}
