import { LightningElement } from 'lwc';
import {
    getFocusedTabInfo,
    focusTab
} from 'lightning/platformWorkspaceApi';
 
export default class FocusTabDemo extends LightningElement {
    message = '';
 
    async handleFocusTab() {
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await focusTab(tabInfo.tabId);
 
            this.message = 'Workspace tab focused successfully.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message || error?.message || 'Unknown error');
        }
    }
}
 