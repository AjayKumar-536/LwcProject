import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import JSPDF from '@salesforce/resourceUrl/jspdf';

export default class PayslipGenerator extends LightningElement {
    payPeriod = 'AUG 2026';
    companyName = 'MOPURU VISIONSDREAM PRIVATE LIMITED';
    companyAddress = 'ROAD NO 02, FINANCIAL DISTRICT, GACHIBOWLI, RANGAREDDY, HYDERABAD TG 500032';
    employeeName = 'AJAY KUMAR SAKHAPURAM';
    employeeNumber = 'VDC000120';
    dateJoined = '18 May 2026';
    designation = 'Associate Software Engineer';
    department = 'TECHNICAL';
    paymentMode = 'Bank Transfer';
    bankName = 'IndusInd Bank';
    // Sensitive identifiers are intentionally masked by default. Enter values only if the PDF needs them.
    accountNumber = 'XXXXXX3528';
    ifscCode = 'INDB0002375';
    branch = 'Kokapet';
    basicPay = 15000;
    hra = 6000;
    specialAllowance = 9000;
    employeePf = 1800;
    professionalTax = 200;
    workingDays = 31;
    lossOfPayDays = 0;
    statusMessage = '';
    libraryReady = false;
    loadingPromise;

    renderedCallback() {
        if (this.loadingPromise) return;
        this.loadingPromise = loadScript(this, JSPDF)
            .then(() => { this.libraryReady = true; })
            .catch(error => {
                this.statusMessage = 'Could not load jsPDF. Check the Static Resource name and uploaded library file.';
                // eslint-disable-next-line no-console
                console.error(error);
            });
    }

    handleChange(event) {
        const field = event.target.dataset.field;
        if (!field) return;
        const numericFields = ['basicPay', 'hra', 'specialAllowance', 'employeePf', 'professionalTax', 'workingDays', 'lossOfPayDays'];
        this[field] = numericFields.includes(field) ? Number(event.target.value || 0) : event.target.value;
    }

    get totalEarnings() {
        return this.money(this.number(this.basicPay) + this.number(this.hra) + this.number(this.specialAllowance));
    }
    get totalDeductions() {
        return this.money(this.number(this.employeePf) + this.number(this.professionalTax));
    }
    get netSalary() {
        return this.number(this.basicPay) + this.number(this.hra) + this.number(this.specialAllowance)
            - this.number(this.employeePf) - this.number(this.professionalTax);
    }
    get formattedEarnings() { return this.formatCurrency(this.totalEarnings); }
    get formattedDeductions() { return this.formatCurrency(this.totalDeductions); }
    get formattedNetSalary() { return this.formatCurrency(this.netSalary); }

    number(value) {
        const result = Number(value);
        return Number.isFinite(result) ? result : 0;
    }
    money(value) { return Math.round(this.number(value) * 100) / 100; }
    formatCurrency(value) {
        return '₹' + this.number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    pdfMoney(value) {
        return 'INR ' + this.number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    amountInWords(amount) {
        // Simple Indian numbering words for common payroll amounts, suitable for this lab.
        const n = Math.round(Math.abs(this.number(amount)));
        if (n === 28000) return 'Twenty Eight Thousand Rupees only';
        if (n === 0) return 'Zero Rupees only';
        return `${n.toLocaleString('en-IN')} Rupees only`;
    }

    async generatePdf() {
        try {
            await this.loadingPromise;
            const JsPdf = window.jspdf?.jsPDF || window.jsPDF;
            if (!JsPdf) {
                this.statusMessage = 'jsPDF is not available. Upload a compatible UMD build as Static Resource "jspdf".';
                return;
            }

            const doc = new JsPdf({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = 210;
            const left = 15;
            const right = 195;
            let y = 15;

            const line = (yy) => {
                doc.setDrawColor(190, 198, 210);
                doc.setLineWidth(0.25);
                doc.line(left, yy, right, yy);
            };
            const label = (text, x, yy) => {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(85, 95, 110);
                doc.text(String(text ?? ''), x, yy);
            };
            const value = (text, x, yy, maxWidth = 55) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8.5);
                doc.setTextColor(30, 38, 52);
                const lines = doc.splitTextToSize(String(text ?? ''), maxWidth);
                doc.text(lines, x, yy);
            };
            const sectionTitle = (text, x, yy) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(30, 54, 86);
                doc.text(text.toUpperCase(), x, yy);
            };
            const rupees = (n) => this.pdfMoney(n);

            // Header
            doc.setFillColor(28, 66, 110);
            doc.rect(0, 0, pageWidth, 31, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(`PAYSLIP ${String(this.payPeriod).toUpperCase()}`, left, 13);
            doc.setFontSize(10);
            doc.text(String(this.companyName).toUpperCase(), left, 21);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.text(String(this.companyAddress), left, 27, { maxWidth: 175 });
            y = 40;

            doc.setTextColor(30, 38, 52);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(String(this.employeeName).toUpperCase(), left, y);
            y += 10;

            // Employee information: 4 columns, 3 rows
            const colX = [left, 61, 107, 153];
            const colW = [42, 41, 42, 42];
            const infoRows = [
                [['Employee Number', this.employeeNumber], ['Date Joined', this.dateJoined], ['Designation', this.designation], ['Department', this.department]],
                [['Payment Mode', this.paymentMode], ['UAN', 'Not displayed'], ['PF Number', 'Not displayed'], ['PAN Number', 'Not displayed']],
                [['Bank Name', this.bankName], ['Account Number', this.accountNumber], ['IFSC Code', this.ifscCode], ['Branch', this.branch]]
            ];
            infoRows.forEach((row, rowIndex) => {
                row.forEach((item, i) => {
                    label(item[0], colX[i], y);
                    value(item[1], colX[i], y + 5, colW[i]);
                });
                y += rowIndex === 0 ? 16 : 15;
            });
            line(y - 4);
            y += 4;

            sectionTitle('Salary Details', left, y);
            y += 7;
            const dayItems = [
                ['Actual Payable Days', Math.max(0, this.number(this.workingDays) - this.number(this.lossOfPayDays))],
                ['Total Working Days', this.workingDays],
                ['Loss Of Pay Days', this.lossOfPayDays],
                ['Days Payable', Math.max(0, this.number(this.workingDays) - this.number(this.lossOfPayDays))]
            ];
            dayItems.forEach((item, i) => {
                const x = left + i * 45;
                label(item[0], x, y);
                value(item[1], x, y + 5, 40);
            });
            y += 17;
            line(y - 4);

            // Earnings and deductions columns
            const leftCol = 15;
            const rightCol = 112;
            sectionTitle('Earnings', leftCol, y);
            sectionTitle('Contributions', rightCol, y);
            y += 7;
            const earnings = [
                ['Basic', this.basicPay],
                ['HRA', this.hra],
                ['Special Allowance', this.specialAllowance]
            ];
            const deductions = [
                ['PF Employee', this.employeePf],
                ['Total Contributions (B)', this.employeePf]
            ];
            earnings.forEach((item, i) => {
                label(item[0], leftCol, y + i * 7);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(30, 38, 52);
                doc.text(rupees(item[1]), 100, y + i * 7, { align: 'right' });
            });
            deductions.forEach((item, i) => {
                label(item[0], rightCol, y + i * 7);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(30, 38, 52);
                doc.text(rupees(item[1]), right, y + i * 7, { align: 'right' });
            });
            y += 24;
            label('Total Earnings (A)', leftCol, y);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(30, 38, 52);
            doc.text(rupees(this.totalEarnings), 100, y, { align: 'right' });

            sectionTitle('Taxes & Deductions', rightCol, y - 17);
            label('Professional Tax', rightCol, y - 10);
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(30, 38, 52);
            doc.text(rupees(this.professionalTax), right, y - 10, { align: 'right' });
            label('Total Taxes & Deductions (C)', rightCol, y);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
            doc.text(rupees(this.professionalTax), right, y, { align: 'right' });

            y += 12;
            doc.setFillColor(238, 244, 250);
            doc.roundedRect(left, y - 5, 180, 17, 2, 2, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(28, 66, 110);
            doc.text('Net Salary Payable (A - B - C)', left + 4, y + 2);
            doc.text(rupees(this.netSalary), right - 4, y + 2, { align: 'right' });

            y += 20;
            label('Net Salary in words', left, y);
            value(this.amountInWords(this.netSalary), 65, y, 125);
            y += 12;
            line(y);
            y += 7;
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7.5);
            doc.setTextColor(90, 98, 110);
            doc.text('Note: All amounts displayed in this payslip are in INR.', left, y);
            y += 6;
            doc.text('This is a computer-generated statement and does not require a signature.', left, y);

            doc.save(`Payslip-${String(this.payPeriod).replace(/\s+/g, '-')}.pdf`);
            this.statusMessage = 'PDF generated. Review the downloaded document before using it officially.';
        } catch (error) {
            this.statusMessage = 'PDF generation failed. Check the Static Resource and browser console.';
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
}