import { LightningElement } from 'lwc';
import buildPdfUrl from
    '@salesforce/apex/PayslipController.buildPdfUrl';

export default class PayslipGenerator extends LightningElement {
    employeeName = '';
    employeeId = '';
    department = '';
    basicSalary = 0;
    allowances = 0;
    deductions = 0;

    isLoading = false;
    errorMessage = '';

    handleChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;

        if (field === 'basicSalary' ||
            field === 'allowances' ||
            field === 'deductions') {
            this[field] = value === '' ? 0 : Number(value);
        } else {
            this[field] = value;
        }
    }

    get grossSalary() {
        return this.basicSalary + this.allowances;
    }

    get netSalary() {
        return this.grossSalary - this.deductions;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(amount);
    }

    get grossSalaryDisplay() {
        return this.formatCurrency(this.grossSalary);
    }

    get netSalaryDisplay() {
        return this.formatCurrency(this.netSalary);
    }

    async generatePDF() {
        this.errorMessage = '';

        const inputs = [
            ...this.template.querySelectorAll('lightning-input')
        ];

        const valid = inputs.reduce((result, input) => {
            input.reportValidity();
            return input.checkValidity() && result;
        }, true);

        if (!valid) {
            this.errorMessage = 'Please check the required fields.';
            return;
        }

        if (
            ![this.basicSalary, this.allowances, this.deductions]
                .every(value => Number.isFinite(value) && value >= 0)
        ) {
            this.errorMessage =
                'Salary values must be valid non-negative numbers.';
            return;
        }

        if (this.deductions > this.grossSalary) {
            this.errorMessage =
                'Deductions cannot exceed gross salary.';
            return;
        }

        this.isLoading = true;

        try {
            const url = await buildPdfUrl({
                employeeName: this.employeeName,
                employeeId: this.employeeId,
                department: this.department,
                basicSalary: this.basicSalary,
                allowances: this.allowances,
                deductions: this.deductions
            });

            window.open(url, '_blank');
        } catch (error) {
            this.errorMessage =
                error?.body?.message || 'Unable to generate the PDF.';
        } finally {
            this.isLoading = false;
        }
    }
}
