
import { LightningElement, wire } from 'lwc';

import {
    IsConsoleNavigation
} from 'lightning/platformWorkspaceApi';

export default class ConsoleChecker extends LightningElement {

    isConsole = false;
    isLoaded = false;
    errorMessage = '';

    @wire(IsConsoleNavigation)
    wiredConsoleNavigation(result) {

        // Protect against null or undefined wire results
        if (!result) {
            return;
        }

        const { data, error } = result;

        if (data !== undefined) {
            this.isConsole = data;
            this.isLoaded = true;
            this.errorMessage = '';
        } else if (error) {
            this.isConsole = false;
            this.isLoaded = true;
            this.errorMessage =
                error.body?.message || 'Unable to detect console navigation';
        }
    }

    get consoleStatus() {
        return this.isConsole
            ? 'You are using a Lightning Console App.'
            : 'You are not using a Lightning Console App.';
    }
}
