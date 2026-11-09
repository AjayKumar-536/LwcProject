import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAppointments from '@salesforce/apex/AppointmentController.getAppointments';
import updateStatus from '@salesforce/apex/AppointmentController.updateStatus';
import { refreshApex } from '@salesforce/apex';
export default class AppointmentManagement extends LightningElement {
  appointments=[]; wiredResult;
  columns=[
    {label:'Appointment',fieldName:'Name'},
    {label:'Patient',fieldName:'patientName'},
    {label:'Doctor',fieldName:'doctorName'},
    {label:'Date',fieldName:'Appointment_Date__c',type:'date'},
    {label:'Status',fieldName:'Status__c'},
    {type:'action',typeAttributes:{rowActions:[
      {label:'Confirm',name:'confirm'},{label:'Complete',name:'complete'},{label:'Cancel',name:'cancel'}
    ]}}
  ];
  @wire(getAppointments,{fromDate:null,toDate:null}) wired(result){
    this.wiredResult=result;
    if(result.data)this.appointments=result.data.map(r=>({...r,patientName:r.Patient__r?.Name,doctorName:r.Doctor__r?.Name}));
  }
  async handleAction(e){
    const status={confirm:'Confirmed',complete:'Completed',cancel:'Cancelled'}[e.detail.action.name];
    if(!status)return;
    try{
      await updateStatus({appointmentId:e.detail.row.Id,newStatus:status});
      this.dispatchEvent(new ShowToastEvent({title:'Updated',message:'Appointment '+status.toLowerCase()+'.',variant:'success'}));
      await refreshApex(this.wiredResult);
    }catch(err){this.dispatchEvent(new ShowToastEvent({title:'Error',message:err.body?.message || 'Update failed.',variant:'error'}));}
  }
}
