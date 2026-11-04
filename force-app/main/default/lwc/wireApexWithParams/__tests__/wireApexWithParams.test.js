
import { createElement } from 'lwc';
import WireApexWithParams from 'c/wireApexWithParams';

import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

import filterAccountTypeType
    from '@salesforce/apex/AccountController.filterAccountTypeType';

const mockFilterAccountTypeType =
    registerApexTestWireAdapter(filterAccountTypeType);

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('c-wire-apex-with-params', () => {

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the component', () => {

        const element = createElement('c-wire-apex-with-params', {
            is: WireApexWithParams
        });

        document.body.appendChild(element);

        expect(element).toBeTruthy();

        const combobox =
            element.shadowRoot.querySelector('lightning-combobox');

        expect(combobox).not.toBeNull();
        expect(combobox.label).toBe('Choose your Type');
    });

    it('displays accounts returned from Apex', async () => {

        const element = createElement('c-wire-apex-with-params', {
            is: WireApexWithParams
        });

        document.body.appendChild(element);

        const mockAccounts = [
            {
                Id: '001000000000001',
                Name: 'ABC Technologies',
                Type: 'Customer - Channel'
            },
            {
                Id: '001000000000002',
                Name: 'XYZ Solutions',
                Type: 'Customer - Direct'
            }
        ];

        mockFilterAccountTypeType.emit(mockAccounts);

        await flushPromises();

        const accountElements =
            element.shadowRoot.querySelectorAll('.slds-box');

        expect(accountElements.length).toBe(2);

        expect(element.shadowRoot.textContent)
            .toContain('ABC Technologies');

        expect(element.shadowRoot.textContent)
            .toContain('XYZ Solutions');
    });

    it('updates selected type when combobox changes', async () => {

        const element = createElement('c-wire-apex-with-params', {
            is: WireApexWithParams
        });

        document.body.appendChild(element);

        const combobox =
            element.shadowRoot.querySelector('lightning-combobox');

        combobox.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    value: 'Customer - Direct'
                }
            })
        );

        await flushPromises();

        expect(element.selectedType).toBe('Customer - Direct');
    });

});

