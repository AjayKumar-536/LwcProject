import { LightningElement, api } from "lwc";
export default class HotelRoomManager extends LightningElement {
  @api rooms = [];
  selected = "All";
  get filters() {
    return ["All", "Available", "Occupied", "Maintenance"].map((value) => ({
      value,
      label: value,
      css: this.selected === value ? "active" : ""
    }));
  }
  get visibleRooms() {
    return this.rooms
      .filter((r) => this.selected === "All" || r.status === this.selected)
      .map((r) => ({ ...r, statusCss: "status " + r.status.toLowerCase() }));
  }
  filterRooms(e) {
    this.selected = e.currentTarget.dataset.value;
  }
}
