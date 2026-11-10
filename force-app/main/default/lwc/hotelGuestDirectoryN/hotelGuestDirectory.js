import { LightningElement } from 'lwc';
export default class HotelGuestDirectory extends LightningElement {term='';guests=[{id:'1',name:'Aarav Sharma',email:'aarav@example.test'},{id:'2',name:'Maya Rao',email:'maya@example.test'}];change(e){this.term=e.target.value.toLowerCase();}get visible(){return this.guests.filter(g=>(g.name+g.email).toLowerCase().includes(this.term));}}
