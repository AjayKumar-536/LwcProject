import { LightningElement } from 'lwc';
import {
    getFocusedTabInfo,
    disableTabClose
} from 'lightning/platformWorkspaceApi';
 
export default class EnableWorkspaceTabClose extends LightningElement {
    message = '';
 
    async handleEnableTabClose() {
        try {
            const tabInfo = await getFocusedTabInfo();
 
            await disableTabClose(tabInfo.tabId, false);
 
            this.message = 'Workspace tab closing is now enabled.';
        } catch (error) {
            this.message =
                'Error: ' +
                (error?.body?.message ||
                    error?.message ||
                    'Unknown error');
        }
    }
}
 