import { LightningElement } from 'lwc';
import {
    getFocusedTabInfo,
    openSubtab
} from 'lightning/platformWorkspaceApi';
 
export default class OpenContactSubtab extends LightningElement {
    message = '';
 
    async handleOpenContact() {
        this.message = 'Opening Contact record...';
 
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await openSubtab(tabInfo.tabId, {
                pageReference: {
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: '003bm000027WHK1AAO',
                        objectApiName: 'Contact',
                        actionName: 'view'
                    }
                },
                focus: true
            });
 
            this.message = 'Contact record opened successfully.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message || error?.message || 'Unknown error');
        }
    }
}
 