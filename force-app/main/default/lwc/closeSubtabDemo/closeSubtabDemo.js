import { LightningElement } from 'lwc';
import {
    getAllTabInfo,
    closeTab
} from 'lightning/platformWorkspaceApi';
 
export default class CloseWorkspaceSubtab extends LightningElement {
    message = '';
 
    async handleCloseSubtab() {
        try {
            const tabs = await getAllTabInfo();
 
            let subtab = null;
 
            for (const tab of tabs) {
                if (tab.subtabs && tab.subtabs.length > 0) {
                    subtab = tab.subtabs[0];
                    break;
                }
            }
 
            if (!subtab) {
                this.message = 'No subtabs are currently open.';
                return;
            }
 
            await closeTab(subtab.tabId);
            this.message = 'Subtab closed successfully.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message || error?.message || 'Unknown error');
        }
    }
}
 