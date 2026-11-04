import { LightningElement } from 'lwc';
import LightningPrompt from 'lightning/prompt';
import LightningAlert from 'lightning/alert';

export default class LightningPromptDemo extends LightningElement {
    statusMessage = 'Click the button to check eligibility.';

    async handleCheckEligibility() {
        // Ask the user to enter their age
        const result = await LightningPrompt.open({
            label: 'Voting Eligibility',
            message: 'Please enter your age:',
            defaultValue: '18',
            variant: 'header'
        });

        // Handle Cancel
        if (result === null) {
            this.statusMessage = 'Eligibility check cancelled.';
            return;
        }

        // Validate the entered value
        const ageText = result.trim();
        const age = Number(ageText);

        if (
            ageText === '' ||
            !Number.isFinite(age) ||
            !Number.isInteger(age) ||
            age < 0 ||
            age > 120
        ) {
            this.statusMessage = 'Invalid age entered.';

            await LightningAlert.open({
                label: 'Invalid Input',
                message: 'Please enter a valid whole number between 0 and 120.',
                theme: 'error'
            });

            return;
        }

        // Check voting eligibility
        if (age >= 18) {
            this.statusMessage = 'You are eligible to vote.';

            await LightningAlert.open({
                label: 'Eligible',
                message: `Your age is ${age}. You are eligible to vote.`,
                theme: 'success'
            });
        } else {
            this.statusMessage = 'You are not yet eligible to vote.';

            await LightningAlert.open({
                label: 'Not Eligible',
                message: `Your age is ${age}. You must be at least 18 to vote.`,
                theme: 'warning'
            });
        }
    }
}