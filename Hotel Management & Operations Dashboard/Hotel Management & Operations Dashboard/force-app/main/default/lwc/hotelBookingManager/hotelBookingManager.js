import { LightningElement, api } from "lwc";
export default class HotelBookingManager extends LightningElement {
  @api bookings = [];
  term = "";
  status = "All";
  sort = "newest";
  page = 1;
  size = 4;
  get filtered() {
    let a = this.bookings.filter(
      (b) =>
        `${b.id} ${b.guest} ${b.room}`
          .toLowerCase()
          .includes(this.term.toLowerCase()) &&
        (this.status === "All" || b.status === this.status)
    );
    a = [...a];
    if (this.sort === "amount") a.sort((x, y) => y.amount - x.amount);
    if (this.sort === "guest") a.sort((x, y) => x.guest.localeCompare(y.guest));
    if (this.sort === "newest") a.sort((x, y) => y.id.localeCompare(x.id));
    return a;
  }
  get pages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.size));
  }
  get pageRows() {
    return this.filtered.slice(
      (this.page - 1) * this.size,
      this.page * this.size
    );
  }
  get start() {
    return this.filtered.length ? (this.page - 1) * this.size + 1 : 0;
  }
  get end() {
    return Math.min(this.page * this.size, this.filtered.length);
  }
  get first() {
    return this.page === 1;
  }
  get last() {
    return this.page >= this.pages;
  }
  get empty() {
    return !this.filtered.length;
  }
  search(e) {
    this.term = e.target.value;
    this.page = 1;
  }
  statusChange(e) {
    this.status = e.target.value;
    this.page = 1;
  }
  sortChange(e) {
    this.sort = e.target.value;
  }
  prev() {
    if (!this.first) this.page--;
  }
  next() {
    if (!this.last) this.page++;
  }
  create() {
    this.dispatchEvent(new CustomEvent("createbooking"));
  }
}
