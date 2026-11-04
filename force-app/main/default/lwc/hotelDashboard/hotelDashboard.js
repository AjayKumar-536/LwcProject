import { LightningElement, api } from "lwc";
export default class HotelDashboard extends LightningElement {
  @api bookings = [];
  @api rooms = [];
  @api guests = [];
  get bookingCount() {
    return this.bookings.length;
  }
  get guestCount() {
    return this.guests.length;
  }
  get available() {
    return this.rooms.filter((x) => x.status === "Available").length;
  }
  get occupied() {
    return this.rooms.filter((x) => x.status === "Occupied").length;
  }
  get maintenance() {
    return this.rooms.filter((x) => x.status === "Maintenance").length;
  }
  get occupancy() {
    return this.rooms.length
      ? Math.round((this.occupied / this.rooms.length) * 100)
      : 0;
  }
  get progress() {
    return `width:${this.occupancy}%`;
  }
  get revenue() {
    return this.bookings
      .filter((x) => x.status !== "Cancelled")
      .reduce((s, x) => s + x.amount, 0);
  }
  get revenueLabel() {
    return "₹" + this.revenue.toLocaleString("en-IN");
  }
}
