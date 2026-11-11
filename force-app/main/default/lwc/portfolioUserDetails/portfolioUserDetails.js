import { LightningElement, api } from 'lwc';

export default class PortfolioUserDetails extends LightningElement {
    @api recordId
    @api objectApiName
    @api resumeUrl
    downloadResume(){
        window.open(this.resumeUrl,"_blank")
    }
    //https://github.com/AjayKumar-536/ajay-resume/blob/main/Ajay_Kumar_devi.1st.pdf"
}