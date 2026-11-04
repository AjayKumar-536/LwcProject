import { LightningElement } from 'lwc';
import {
    getFocusedTabInfo,
    disableTabClose
} from 'lightning/platformWorkspaceApi';
 
export default class DisableWorkspaceTab extends LightningElement {
    message = '';
 
    async handleDisableTab() {
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await disableTabClose(tabInfo.tabId, true);
 
            this.message = 'Closing this workspace tab is now disabled.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message ||
                    error?.message ||
                    'Unknown error');
        }
    }
}
 