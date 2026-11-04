import { LightningElement, api } from 'lwc';

export default class BirthdayWish extends LightningElement {

    @api recipientName = 'My Beautiful Sister';

    @api birthdayMessage =
        'Happy Birthday to someone who means the world to me!';

    @api videoUrl = '';

    showSurprise = false;

    handleSurprise() {
        this.showSurprise = !this.showSurprise;
    }
}
