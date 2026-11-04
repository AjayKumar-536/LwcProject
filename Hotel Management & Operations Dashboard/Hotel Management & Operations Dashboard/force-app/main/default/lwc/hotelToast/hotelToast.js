import { LightningElement } from "lwc";
export default class HotelToast extends LightningElement {
  visible = false;
  message = "";
  timer;
  show(message) {
    this.message = message;
    this.visible = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.visible = false), 2800);
  }
  disconnectedCallback() {
    clearTimeout(this.timer);
  }
}
