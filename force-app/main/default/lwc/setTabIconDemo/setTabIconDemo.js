import { LightningElement, wire } from 'lwc';

import {
    IsConsoleNavigation,
    getFocusedTabInfo,
    setTabIcon
} from 'lightning/platformWorkspaceApi';

export default class SetTabIconDemo extends LightningElement {

    isConsole = false;

    @wire(IsConsoleNavigation)
wiredNavigation(result) {

    if (!result) {
        return;
    }

    const { data, error } = result;

    if (data !== undefined) {
        this.isConsole = data;
    }

    if (error) {
        this.isConsole = false;
        console.error('Console navigation error:', error);
    }
}

    async changeTabIcon() {

        try {

            if (!this.isConsole) {
                return;
            }

            const tabInfo = await getFocusedTabInfo();

            await setTabIcon(
                tabInfo.tabId,
                'utility:approval',
                {
                    iconAlt: 'Approved Customer'
                }
            );

            console.log('Tab icon changed');

        } catch (error) {
            console.error(error);
        }
    }

    async setWarningIcon() {

        try {

            const tabInfo = await getFocusedTabInfo();

            await setTabIcon(
                tabInfo.tabId,
                'utility:warning',
                {
                    iconAlt: 'Warning'
                }
            );

        } catch (error) {
            console.error(error);
        }
    }
}