import { LightningElement, api } from "lwc";
export default class HotelGuestDirectory extends LightningElement {
  @api guests = [];
  term = "";
  search(e) {
    this.term = e.target.value.toLowerCase();
  }
  get results() {
    return this.guests
      .filter((g) =>
        `${g.name} ${g.email} ${g.phone}`.toLowerCase().includes(this.term)
      )
      .map((g) => ({
        ...g,
        initials: g.name
          .split(" ")
          .map((x) => x[0])
          .join("")
          .slice(0, 2),
        tierCss: "tier " + g.tier.toLowerCase()
      }));
  }
}
