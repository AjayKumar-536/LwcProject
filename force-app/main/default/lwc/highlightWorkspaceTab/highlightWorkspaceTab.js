import { LightningElement } from 'lwc';
import {
    getFocusedTabInfo,
    setTabHighlighted
} from 'lightning/platformWorkspaceApi';
 
export default class HighlightWorkspaceTab extends LightningElement {
    message = '';
 
    async handleHighlightTab() {
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await setTabHighlighted(tabInfo.tabId, true, {
                state: 'success',
                pulse: true
            });
 
            this.message = 'Workspace tab highlighted successfully.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message ||
                    error?.message ||
                    JSON.stringify(error));
            console.error('Highlight tab error:', error);
        }
    }
}
 