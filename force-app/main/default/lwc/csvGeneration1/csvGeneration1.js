import { LightningElement } from 'lwc';
 
export default class CsvLwsDemo extends LightningElement {
    downloadUrl = '';
    message = '';
 
    handleGenerate() {
        const employees = [
            ['Employee Name', 'Department', 'Salary'],
            ['Ajay Kumar', 'Development', 35000],
            ['Ravi', 'Testing', 30000],
            ['Prasad', 'Administration', 32000]
        ];
 
        const csvContent = employees
            .map(row =>
                row.map(value => {
                    const text = String(value ?? '');
                    return '"' + text.replace(/"/g, '""') + '"';
                }).join(',')
            )
            .join('\r\n');
 
        this.downloadUrl =
            'data:text/csv;charset=utf-8,' +
            encodeURIComponent('\uFEFF' + csvContent);
 
        this.message = 'CSV created. Click the download link below.';
    }
}