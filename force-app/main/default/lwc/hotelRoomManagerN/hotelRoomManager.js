import { LightningElement } from 'lwc';
import searchRooms from '@salesforce/apex/AgodaHotelController.searchRooms';
export default class HotelRoomManager extends LightningElement {
 propertyId=''; checkIn=''; checkOut=''; adults=2; rooms=1; currencyCode='USD'; results=[]; loading=false; error='';
 currencies=[{label:'USD',value:'USD'},{label:'INR',value:'INR'},{label:'EUR',value:'EUR'}];
 connectedCallback(){const d=new Date();const a=new Date(d);a.setDate(d.getDate()+1);const b=new Date(d);b.setDate(d.getDate()+2);this.checkIn=this.fmt(a);this.checkOut=this.fmt(b);}
 fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 propertyChange(e){this.propertyId=e.detail.value;} checkInChange(e){this.checkIn=e.detail.value;} checkOutChange(e){this.checkOut=e.detail.value;} adultsChange(e){this.adults=Number(e.detail.value);} roomsChange(e){this.rooms=Number(e.detail.value);} currencyChange(e){this.currencyCode=e.detail.value;}
 async search(){this.error='';this.results=[];const id=Number(this.propertyId);if(!Number.isInteger(id)||id<1){this.error='Enter a valid authorized property ID.';return;}if(!this.checkIn||!this.checkOut||this.checkOut<=this.checkIn){this.error='Check-out must be later than check-in.';return;}this.loading=true;try{const raw=await searchRooms({propertyIds:[id],checkIn:this.checkIn,checkOut:this.checkOut,rooms:this.rooms,adults:this.adults,children:0,currencyCode:this.currencyCode});this.results=this.mapResponse(JSON.parse(raw));if(!this.results.length)this.error='No properties were mapped. Update mapResponse() to match your partner API response.';}catch(e){this.error=e?.body?.message||e.message||'Availability search failed.';}finally{this.loading=false;}}
 // Adapt these fields after reviewing a sanitized response from your Agoda partner API.
 mapResponse(data){const rows=data?.properties||data?.data?.properties||[];if(!Array.isArray(rows))return [];return rows.map((p,i)=>({key:String(p.propertyId||p.id||i),name:p.propertyName||p.name||`Property ${p.propertyId||i+1}`,location:p.address||p.city||'Location not supplied',rooms:(p.rooms||p.roomTypes||[]).map((x,j)=>({key:String(x.roomId||x.id||j),name:x.roomName||x.name||'Room',price:x.rate?.total?`${this.currencyCode} ${x.rate.total}`:x.price?`${this.currencyCode} ${x.price}`:'Rate not supplied'}))}));}
}
