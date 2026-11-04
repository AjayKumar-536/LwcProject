import { LightningElement } from 'lwc';
import {
    getFocusedTabInfo,
    setTabIcon
} from 'lightning/platformWorkspaceApi';
 
export default class SetWorkspaceTabIcon extends LightningElement {
    message = '';
 
    async handleSetIcon() {
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await setTabIcon(tabInfo.tabId, 'utility:apps', {
                iconAlt: 'Apps'
            });
 
            this.message = 'Tab icon updated successfully.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message ||
                    error?.message ||
                    'Unknown error');
        }
    }
}
 