import { LightningElement } from 'lwc';
import { openTab } from 'lightning/platformWorkspaceApi';
 
export default class WorkspaceOpenTab extends LightningElement {
    message = 'Click the button to open a new tab.';
    errorDetails = '';
 
    async handleOpenTab() {
        this.errorDetails = '';
 
        try {
            const tabId = await openTab({
                url: '/lightning/page/home',
                label: 'My New Workspace Tab',
                focus: true
            });
 
            this.message = 'New tab opened successfully!';
            console.log('New tab ID:', tabId);
        } catch (error) {
            this.message = 'Could not open the tab.';
            this.errorDetails =
                error?.message || JSON.stringify(error);
 
            console.error('Workspace API error:', error);
        }
    }
}