
import { createElement } from 'lwc';
import CustomerFollowUpAction from 'c/customerFollowUpAction';

// Mock Salesforce CloseActionScreenEvent
jest.mock(
    'lightning/actions',
    () => ({
        CloseActionScreenEvent: class extends Event {
            constructor() {
                super('close');
            }
        }
    }),
    { virtual: true }
);

describe('c-customer-follow-up-action', () => {

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('renders the component', () => {
        const element = createElement('c-customer-follow-up-action', {
            is: CustomerFollowUpAction
        });

        document.body.appendChild(element);

        expect(element).toBeTruthy();
    });

    it('updates customer name', () => {
        const element = createElement('c-customer-follow-up-action', {
            is: CustomerFollowUpAction
        });

        document.body.appendChild(element);

        element.handleNameChange({
            detail: { value: 'Ajay' }
        });

        expect(element.customerName).toBe('Ajay');
    });

    it('updates follow-up type', () => {
        const element = createElement('c-customer-follow-up-action', {
            is: CustomerFollowUpAction
        });

        document.body.appendChild(element);

        element.handleTypeChange({
            detail: { value: 'Email' }
        });

        expect(element.followUpType).toBe('Email');
    });

    it('updates notes', () => {
        const element = createElement('c-customer-follow-up-action', {
            is: CustomerFollowUpAction
        });

        document.body.appendChild(element);

        element.handleNotesChange({
            detail: { value: 'Discuss project status' }
        });

        expect(element.notes).toBe('Discuss project status');
    });

    it('closes the action when cancel is clicked', () => {
        const element = createElement('c-customer-follow-up-action', {
            is: CustomerFollowUpAction
        });

        document.body.appendChild(element);

        const closeHandler = jest.fn();
        element.addEventListener('close', closeHandler);

        element.handleCancel();

        expect(closeHandler).toHaveBeenCalled();
    });

    it('does not submit when fields are invalid', () => {
        const element = createElement('c-customer-follow-up-action', {
            is: CustomerFollowUpAction
        });

        document.body.appendChild(element);

        const mockField = {
            reportValidity: jest.fn(),
            checkValidity: jest.fn().mockReturnValue(false)
        };

        jest.spyOn(
            element.template,
            'querySelectorAll'
        ).mockReturnValue([mockField]);

        const closeHandler = jest.fn();
        element.addEventListener('close', closeHandler);

        element.handleSubmit();

        expect(mockField.reportValidity).toHaveBeenCalled();
        expect(closeHandler).not.toHaveBeenCalled();
    });
});
