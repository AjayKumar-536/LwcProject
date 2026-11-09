import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPatients from '@salesforce/apex/PatientController.getPatients';
import savePatient from '@salesforce/apex/PatientController.savePatient';
import deletePatient from '@salesforce/apex/PatientController.deletePatient';
import { refreshApex } from '@salesforce/apex';
const ACTIONS=[{label:'Edit',name:'edit'},{label:'Delete',name:'delete'}];
export default class PatientManagement extends LightningElement {
  searchKey=''; patients=[]; wiredResult; showForm=false;
  draft={};
  columns=[
    {label:'Patient Name',fieldName:'Name',type:'text'},
    {label:'Email',fieldName:'Email__c',type:'email'},
    {label:'Phone',fieldName:'Phone__c',type:'phone'},
    {label:'Gender',fieldName:'Gender__c',type:'text'},
    {type:'action',typeAttributes:{rowActions:ACTIONS}}
  ];
  genderOptions=[{label:'Male',value:'Male'},{label:'Female',value:'Female'},{label:'Other',value:'Other'}];
  bloodOptions=['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(v=>({label:v,value:v}));
  @wire(getPatients,{searchKey:'$searchKey'}) wiredPatients(result) {
    this.wiredResult=result;
    if(result.data) this.patients=result.data;
    else if(result.error) this.toast('Error',result.error.body?.message,'error');
  }
  handleSearch(e){this.searchKey=e.target.value;}
  openNew(){this.draft={};this.showForm=true;}
  closeForm(){this.showForm=false;}
  handleField(e){this.draft={...this.draft,[e.target.dataset.field]:e.target.value};}
  async save(){
    const inputs=[...this.template.querySelectorAll('lightning-input')];
    if(!inputs.every(x=>x.reportValidity())) return;
    try { await savePatient({patientRecord:this.draft}); this.toast('Success','Patient saved.','success'); this.closeForm(); await refreshApex(this.wiredResult); }
    catch(e){this.toast('Error',e.body?.message || 'Unable to save patient.','error');}
  }
  async handleRowAction(e){
    const row=e.detail.row;
    if(e.detail.action.name==='edit'){this.draft={...row};this.showForm=true;return;}
    if(e.detail.action.name==='delete'){
      try {await deletePatient({patientId:row.Id});this.toast('Deleted','Patient deleted.','success');await refreshApex(this.wiredResult);}
      catch(err){this.toast('Error',err.body?.message || 'Delete failed.','error');}
    }
  }
  toast(title,message,variant){this.dispatchEvent(new ShowToastEvent({title,message,variant}));}
}
