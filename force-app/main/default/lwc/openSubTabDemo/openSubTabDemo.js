import { LightningElement, wire } from 'lwc';
import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    openSubtab
} from 'lightning/platformWorkspaceApi';
 
export default class OpenSubtabDemo extends LightningElement {
    @wire(IsConsoleNavigation)
    isConsoleNavigation;
 
    message = '';
 
    async handleOpenSubtab() {
        const consoleStatus = this.isConsoleNavigation;
 
        if (consoleStatus === undefined) {
            this.message = 'Checking console status. Please click again.';
            return;
        }
 
        if (consoleStatus === false) {
            this.message = 'Please open this component in a Console app.';
            return;
        }
 
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await openSubtab(tabInfo.tabId, {
                url: '/lightning/o/Contact/list',
                label: 'Contacts',
                focus: true
            });
 
            this.message = 'Subtab opened successfully.';
        } catch (error) {
            this.message = 'Error: ' + error.message;
        }
    }
}