import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getDashboardData from '@salesforce/apex/HospitalDashboardController.getDashboardData';
export default class HospitalDashboard extends LightningElement {
  wiredResult;
  data;
  error;
  @wire(getDashboardData)
  wiredDashboard(result) {
    this.wiredResult = result;
    if (result.data) { this.data = result.data; this.error = undefined; }
    else if (result.error) { this.error = result.error; this.data = undefined; }
  }
  get tiles() {
    if (!this.data) return [];
    return [
      {label:'Patients',value:this.data.patients},
      {label:'Active Doctors',value:this.data.doctors},
      {label:'Appointments Today',value:this.data.appointmentsToday},
      {label:'Pending Appointments',value:this.data.pendingAppointments},
      {label:'Low Stock Medicines',value:this.data.lowStockMedicines}
    ];
  }
  get errorMessage() { return this.error?.body?.message || 'Unable to load dashboard.'; }
  refresh() { return refreshApex(this.wiredResult); }
}
