import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const ICONS = [
    { name: 'Search', code: 'utility:search', category: 'Utility' },
    { name: 'Add', code: 'utility:add', category: 'Utility' },
    { name: 'Edit', code: 'utility:edit', category: 'Utility' },
    { name: 'Delete', code: 'utility:delete', category: 'Utility' },
    { name: 'Settings', code: 'utility:settings', category: 'Utility' },
    { name: 'Download', code: 'utility:download', category: 'Utility' },
    { name: 'Refresh', code: 'utility:refresh', category: 'Utility' },
    { name: 'Email', code: 'utility:email', category: 'Utility' },
    { name: 'Account', code: 'standard:account', category: 'Standard' },
    { name: 'Contact', code: 'standard:contact', category: 'Standard' },
    { name: 'Lead', code: 'standard:lead', category: 'Standard' },
    { name: 'Opportunity', code: 'standard:opportunity', category: 'Standard' },
    { name: 'Case', code: 'standard:case', category: 'Standard' },
    { name: 'Campaign', code: 'standard:campaign', category: 'Standard' },
    { name: 'Edit Action', code: 'action:edit', category: 'Action' },
    { name: 'New Action', code: 'action:new', category: 'Action' },
    { name: 'Delete Action', code: 'action:delete', category: 'Action' },
    { name: 'Approval', code: 'action:approval', category: 'Action' },
    { name: 'PDF', code: 'doctype:pdf', category: 'Doctype' },
    { name: 'Word', code: 'doctype:word', category: 'Doctype' },
    { name: 'Excel', code: 'doctype:excel', category: 'Doctype' },
    { name: 'PowerPoint', code: 'doctype:ppt', category: 'Doctype' },
    { name: 'Custom 1', code: 'custom:custom1', category: 'Custom' },
    { name: 'Custom 2', code: 'custom:custom2', category: 'Custom' }
];

export default class IconExplorer extends LightningElement {
    searchTerm = '';
    selectedCategory = 'All';
    selectedSize = 'small';
    selectedIconName = '';

    categoryOptions = [
        { label: 'All Categories', value: 'All' },
        { label: 'Utility', value: 'Utility' },
        { label: 'Standard', value: 'Standard' },
        { label: 'Action', value: 'Action' },
        { label: 'Doctype', value: 'Doctype' },
        { label: 'Custom', value: 'Custom' }
    ];

    sizeOptions = [
        { label: 'Extra Extra Small', value: 'xx-small' },
        { label: 'Extra Small', value: 'x-small' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' }
    ];

    get filteredIcons() {
        const search = this.searchTerm.trim().toLowerCase();

        return ICONS
            .filter((icon) => {
                const matchesSearch =
                    icon.name.toLowerCase().includes(search) ||
                    icon.code.toLowerCase().includes(search);

                const matchesCategory =
                    this.selectedCategory === 'All' ||
                    icon.category === this.selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .map((icon) => ({
                ...icon,
                cardClass:
                    icon.name === this.selectedIconName
                        ? 'icon-card selected'
                        : 'icon-card'
            }));
    }

    get selectedIcon() {
        const icon = ICONS.find(
            (item) => item.name === this.selectedIconName
        );

        if (!icon) {
            return null;
        }

        return {
            ...icon,
            lwcCode:
                `<lightning-icon\n` +
                `    icon-name="${icon.code}"\n` +
                `    size="${this.selectedSize}"\n` +
                `    alternative-text="${icon.name}">\n` +
                `</lightning-icon>`
        };
    }

    get noResults() {
        return this.filteredIcons.length === 0;
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
    }

    handleSizeChange(event) {
        this.selectedSize = event.detail.value;
    }

    handleSelect(event) {
        this.selectedIconName = event.currentTarget.dataset.name;
    }

    async handleCopy() {
        const code = this.selectedIcon?.lwcCode;

        if (!code) {
            return;
        }

        try {
            if (!navigator.clipboard?.writeText) {
                throw new Error('Clipboard access is unavailable');
            }

            await navigator.clipboard.writeText(code);

            this.showToast(
                'Copied',
                'LWC icon code copied successfully.',
                'success'
            );
        } catch (error) {
            this.showToast(
                'Copy unavailable',
                'Select and copy the code from the text field.',
                'info'
            );
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}
