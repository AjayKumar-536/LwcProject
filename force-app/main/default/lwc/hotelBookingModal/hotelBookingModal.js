import { LightningElement } from "lwc";
export default class HotelBookingModal extends LightningElement {
  guest = "";
  room = "";
  checkIn = "";
  checkOut = "";
  amount = "";
  error = "";
  change(e) {
    this[e.target.dataset.name] = e.target.value;
    this.error = "";
  }
  close() {
    this.dispatchEvent(new CustomEvent("close"));
  }
  save() {
    if (
      !this.guest.trim() ||
      !this.room.trim() ||
      !this.checkIn ||
      !this.checkOut ||
      !this.amount
    ) {
      this.error = "Complete all fields.";
      return;
    }
    if (this.checkOut <= this.checkIn) {
      this.error = "Check-out must be after check-in.";
      return;
    }
    if (Number(this.amount) <= 0) {
      this.error = "Enter a positive amount.";
      return;
    }
    this.dispatchEvent(
      new CustomEvent("savebooking", {
        detail: {
          guest: this.guest.trim(),
          room: this.room.trim(),
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          amount: Number(this.amount),
          status: "Pending"
        }
      })
    );
  }
}
