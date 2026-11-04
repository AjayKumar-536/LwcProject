import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Static Resource named "jsPDF" containing the jsPDF UMD build (jspdf.umd.min.js)
import JSPDF from '@salesforce/resourceUrl/jsPDF';

const COMPANY = {
    name: 'Vision Stream Cloud Company',
    address: 'Bengaluru, Karnataka, India' // Update with your registered address
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const defaultEarnings = () => [
    { key: 'basic', label: 'Basic Salary', value: 0 },
    { key: 'hra', label: 'House Rent Allowance (HRA)', value: 0 },
    { key: 'special', label: 'Special Allowance', value: 0 },
    { key: 'conveyance', label: 'Conveyance Allowance', value: 0 },
    { key: 'bonus', label: 'Bonus / Incentives', value: 0 }
];

const defaultDeductions = () => [
    { key: 'pf', label: 'Provident Fund (PF)', value: 0 },
    { key: 'pt', label: 'Professional Tax', value: 0 },
    { key: 'tds', label: 'Income Tax (TDS)', value: 0 },
    { key: 'other', label: 'Other Deductions', value: 0 }
];

const defaultForm = () => {
    const now = new Date();
    return {
        month: MONTHS[now.getMonth()],
        year: now.getFullYear(),
        employeeName: '',
        employeeId: '',
        designation: '',
        department: '',
        dateOfJoining: '',
        pan: '',
        bankAccount: '',
        workingDays: 30,
        daysPaid: 30
    };
};

const ONES = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const below100 = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : ''));
const below1000 = (n) =>
    (n >= 100 ? ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' : '') : '') +
    (n % 100 ? below100(n % 100) : '');

// Indian numbering system (thousand, lakh, crore)
const integerToWords = (num) => {
    if (num === 0) return 'Zero';
    const parts = [];
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const rest = num % 1000;
    if (crore) parts.push(below1000(crore) + ' Crore');
    if (lakh) parts.push(below100(lakh) + ' Lakh');
    if (thousand) parts.push(below100(thousand) + ' Thousand');
    if (rest) parts.push(below1000(rest));
    return parts.join(' ');
};

const amountToWords = (amount) => {
    const total = Math.round((Number(amount) || 0) * 100);
    const rupees = Math.floor(total / 100);
    const paise = total % 100;
    let words = 'Rupees ' + integerToWords(rupees);
    if (paise) words += ' and ' + below100(paise) + ' Paise';
    return words + ' Only';
};

const fmt = (n) =>
    Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default class PayslipPdfGenerator extends LightningElement {
    form = defaultForm();
    earnings = defaultEarnings();
    deductions = defaultDeductions();
    isGenerating = false;
    jsPdfLoaded = false;

    get monthOptions() {
        return MONTHS.map((m) => ({ label: m, value: m }));
    }

    get totalEarnings() {
        return this.earnings.reduce((sum, e) => sum + (Number(e.value) || 0), 0);
    }

    get totalDeductions() {
        return this.deductions.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    }

    get netPay() {
        return this.totalEarnings - this.totalDeductions;
    }

    get totalEarningsLabel() {
        return 'Rs. ' + fmt(this.totalEarnings);
    }

    get totalDeductionsLabel() {
        return 'Rs. ' + fmt(this.totalDeductions);
    }

    get netPayLabel() {
        return 'Rs. ' + fmt(this.netPay);
    }

    get netPayInWords() {
        return this.netPay >= 0 ? amountToWords(this.netPay) : 'Net pay is negative - please review deductions';
    }

    renderedCallback() {
        if (this.jsPdfLoaded) return;
        this.jsPdfLoaded = true;
        loadScript(this, JSPDF).catch((error) => {
            this.jsPdfLoaded = false;
            this.showToast('Error', 'Unable to load the jsPDF library: ' + this.errorMessage(error), 'error');
        });
    }

    handleFieldChange(event) {
        const { name, value } = event.target;
        this.form = { ...this.form, [name]: value };
    }

    handleAmountChange(event) {
        const { group, key } = event.target.dataset;
        const value = event.target.value;
        this[group] = this[group].map((item) => (item.key === key ? { ...item, value } : item));
    }

    handleReset() {
        this.form = defaultForm();
        this.earnings = defaultEarnings();
        this.deductions = defaultDeductions();
    }

    validate() {
        const inputs = [...this.template.querySelectorAll('lightning-input, lightning-combobox')];
        const allValid = inputs.reduce((valid, input) => {
            input.reportValidity();
            return valid && input.checkValidity();
        }, true);
        if (!allValid) {
            this.showToast('Missing information', 'Please correct the highlighted fields.', 'warning');
            return false;
        }
        if (this.netPay < 0) {
            this.showToast('Invalid amounts', 'Deductions cannot exceed total earnings.', 'warning');
            return false;
        }
        return true;
    }

    async handleGeneratePdf() {
        if (!this.validate()) return;
        this.isGenerating = true;
        try {
            // loadScript is a no-op if the library is already loaded
            await loadScript(this, JSPDF);
            this.buildPdf();
            this.showToast('Success', 'Payslip PDF generated.', 'success');
        } catch (error) {
            this.showToast('Error', 'Could not generate PDF: ' + this.errorMessage(error), 'error');
        } finally {
            this.isGenerating = false;
        }
    }

    getJsPdfConstructor() {
        const g = typeof globalThis !== 'undefined' ? globalThis : window;
        const candidate =
            (window.jspdf && window.jspdf.jsPDF) || // jsPDF 2.x UMD
            (g.jspdf && g.jspdf.jsPDF) ||
            (window.jsPDF && window.jsPDF.jsPDF) ||
            window.jsPDF || // jsPDF 1.x
            g.jsPDF;
        if (typeof candidate !== 'function') {
            throw new Error(
                'jsPDF was not found after loading the static resource "jsPDF". ' +
                    'Make sure it contains the jsPDF 2.x UMD build (jspdf.umd.min.js).'
            );
        }
        return candidate;
    }

    buildPdf() {
        const jsPDF = this.getJsPdfConstructor();
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const f = this.form;
        const left = 15;
        const right = 195;
        const navy = [18, 52, 110];

        // ---- Header band ----
        doc.setFillColor(...navy);
        doc.rect(0, 0, 210, 34, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(COMPANY.name, left, 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(COMPANY.address, left, 21);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Payslip for ${f.month} ${f.year}`, left, 29);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('CONFIDENTIAL', right, 29, { align: 'right' });

        // ---- Employee details ----
        doc.setTextColor(0, 0, 0);
        let y = 44;
        const details = [
            ['Employee Name', f.employeeName, 'Employee ID', f.employeeId],
            ['Designation', f.designation, 'Department', f.department],
            ['Date of Joining', f.dateOfJoining, 'PAN', f.pan],
            ['Bank Account', f.bankAccount, 'Days Paid / Working', `${f.daysPaid || 0} / ${f.workingDays || 0}`]
        ];
        doc.setDrawColor(200, 200, 200);
        details.forEach((row) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(row[0] + ':', left, y);
            doc.text(row[2] + ':', 108, y);
            doc.setFont('helvetica', 'normal');
            doc.text(String(row[1] || '-'), left + 32, y);
            doc.text(String(row[3] || '-'), 108 + 34, y);
            y += 7;
        });
        doc.line(left, y - 3, right, y - 3);

        // ---- Earnings / Deductions tables ----
        y += 4;
        const colW = 87;
        const rightX = 108;
        const rowH = 8;

        const drawHeader = (x, title) => {
            doc.setFillColor(230, 236, 245);
            doc.rect(x, y, colW, rowH, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(title, x + 2, y + 5.5);
            doc.text('Amount (Rs.)', x + colW - 2, y + 5.5, { align: 'right' });
        };
        drawHeader(left, 'Earnings');
        drawHeader(rightX, 'Deductions');

        const maxRows = Math.max(this.earnings.length, this.deductions.length);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        for (let i = 0; i < maxRows; i++) {
            const rowY = y + rowH * (i + 1);
            const e = this.earnings[i];
            const d = this.deductions[i];
            if (e) {
                doc.text(e.label, left + 2, rowY + 5.5);
                doc.text(fmt(e.value), left + colW - 2, rowY + 5.5, { align: 'right' });
            }
            if (d) {
                doc.text(d.label, rightX + 2, rowY + 5.5);
                doc.text(fmt(d.value), rightX + colW - 2, rowY + 5.5, { align: 'right' });
            }
        }

        // Totals row
        const totalsY = y + rowH * (maxRows + 1);
        doc.setFillColor(245, 245, 245);
        doc.rect(left, totalsY, colW, rowH, 'F');
        doc.rect(rightX, totalsY, colW, rowH, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Total Earnings', left + 2, totalsY + 5.5);
        doc.text(fmt(this.totalEarnings), left + colW - 2, totalsY + 5.5, { align: 'right' });
        doc.text('Total Deductions', rightX + 2, totalsY + 5.5);
        doc.text(fmt(this.totalDeductions), rightX + colW - 2, totalsY + 5.5, { align: 'right' });

        // Table outlines
        const tableH = rowH * (maxRows + 2);
        doc.setDrawColor(160, 160, 160);
        doc.rect(left, y, colW, tableH);
        doc.rect(rightX, y, colW, tableH);

        // ---- Net pay ----
        let netY = y + tableH + 10;
        doc.setFillColor(...navy);
        doc.rect(left, netY, right - left, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('NET PAY', left + 3, netY + 8);
        doc.text(`Rs. ${fmt(this.netPay)}`, right - 3, netY + 8, { align: 'right' });

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        netY += 19;
        doc.text(`Amount in words: ${amountToWords(this.netPay)}`, left, netY);

        // ---- Signatures ----
        const sigY = netY + 30;
        doc.setDrawColor(120, 120, 120);
        doc.line(left, sigY, left + 55, sigY);
        doc.line(right - 55, sigY, right, sigY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Employee Signature', left, sigY + 5);
        doc.text('Authorised Signatory', right - 55, sigY + 5);

        // ---- Footer ----
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(
            'This is a system-generated payslip and does not require a signature.',
            105,
            285,
            { align: 'center' }
        );

        const safeName = (f.employeeName || 'Employee').replace(/[^a-z0-9]+/gi, '_');
        doc.save(`Payslip_${safeName}_${f.month}_${f.year}.pdf`);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    errorMessage(error) {
        return (error && (error.message || (error.body && error.body.message))) || String(error);
    }
}