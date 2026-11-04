import { LightningElement } from 'lwc';

export default class CsvGeneration extends LightningElement {

    statusMessage = '';

    students = [
        { id: 1, name: 'Ajay', department: 'IT', marks: 92 },
        { id: 2, name: 'Vishnu', department: 'CSE', marks: 85 },
        { id: 3, name: 'Dinesh', department: 'CD', marks: 88 },
        { id: 4, name: 'Rajesh', department: 'IT', marks: 78 },
        { id: 5, name: 'Mahendra', department: 'CSE', marks: 95 }
    ];

    columns = [
        { label: 'Student Name', fieldName: 'name' },
        { label: 'Department', fieldName: 'department' },
        { label: 'Marks', fieldName: 'marks', type: 'number' }
    ];

    handleDownloadCSV() {
        // Step 1: Define CSV column headings
        const headers = ['Student Name', 'Department', 'Marks'];

        // Step 2: Convert each value into a valid CSV field
        const escapeCSV = (value) => {
            let text = String(value ?? '');

            // Protect against spreadsheet formula injection
            if (/^[\s]*[=+\-@]/.test(text)) {
                text = "'" + text;
            }

            // Escape quotes and wrap fields containing special characters
            return `"${text.replace(/"/g, '""')}"`;
        };

        // Step 3: Create the CSV rows
        const rows = this.students.map(student => [
            student.name,
            student.department,
            student.marks
        ]);

        // Step 4: Join headings and records into CSV text
        const csvContent = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\r\n');

        // BOM helps Excel recognize UTF-8 text
        const csvWithBOM = '\uFEFF' + csvContent;

        // Step 5: Create the downloadable file
        const blob = new Blob(
            [csvWithBOM],
            { type: 'text/csv;charset=utf-8;' }
        );

        // Step 6: Create a temporary download URL
        const url = URL.createObjectURL(blob);

        // Step 7: Trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'StudentDetails.csv';

        document.body.appendChild(link);
        link.click();
        link.remove();

        // Step 8: Release the temporary URL
        URL.revokeObjectURL(url);

        this.statusMessage = 'CSV download requested successfully.';
    }
}