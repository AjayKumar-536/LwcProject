import { LightningElement } from 'lwc';
import {
    getFocusedTabInfo,
    refreshTab
} from 'lightning/platformWorkspaceApi';
 
export default class RefreshWorkspaceTab extends LightningElement {
    message = '';
 
    async handleRefreshTab() {
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await refreshTab(tabInfo.tabId, true);
 
            this.message = 'Workspace tab and subtabs refreshed successfully.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message || error?.message || 'Unknown error');
        }
    }
}