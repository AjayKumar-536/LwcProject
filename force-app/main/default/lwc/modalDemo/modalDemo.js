import { LightningElement } from 'lwc';

export default class ModalDemo extends LightningElement {
    isModalOpen = false;
    openModal() { this.isModalOpen = true; }
    closeModal() { this.isModalOpen = false; }
}