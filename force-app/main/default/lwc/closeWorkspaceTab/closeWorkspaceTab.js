import { LightningElement, wire } from 'lwc';
 
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    closeTab
} from 'lightning/platformWorkspaceApi';
 
export default class CloseWorkspaceTab extends LightningElement {
 
    message = '';
 
    @wire(IsConsoleNavigation)
    consoleNavigation;
 
    async handleCloseTab() {
        try {
            console.log(
                'Console Navigation:',
                this.consoleNavigation.data
            );
 
            if (this.consoleNavigation.data !== true) {
                this.message = 'Console navigation is not available.';
                return;
            }
 
            const tabInfo = await getFocusedTabInfo();
 
            console.log('Focused Tab Information:', tabInfo);
 
            if (!tabInfo || !tabInfo.tabId) {
                this.message = 'No active workspace tab found.';
                return;
            }
 
            await closeTab(tabInfo.tabId);
 
            this.message = 'Workspace tab closed successfully.';
 
        } catch (error) {
            console.error('Workspace API Error:', error);
 
            this.message =
                error?.body?.message ||
                error?.message ||
                'Unknown error';
        }
    }
}