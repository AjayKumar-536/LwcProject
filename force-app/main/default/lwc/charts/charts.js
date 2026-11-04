import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CHART_JS from '@salesforce/resourceUrl/chartjs';

export default class Charts extends LightningElement {
    chart;
    libraryLoaded = false;

    renderedCallback() {
        if (this.libraryLoaded) return;
        this.libraryLoaded = true;
        loadScript(this, CHART_JS)
            .then(() => this.createChart())
            .catch(error => { console.error('Chart.js failed to load', error); });
    }

    createChart() {
        const canvas = this.template.querySelector('canvas');
        if (!canvas || !window.Chart) return;
        this.chart = new window.Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Maths', 'English', 'Science', 'Telugu'],
                datasets: [{
                    label: 'Marks',
                    data: [19, 8, 8, 9],
                    backgroundColor: ['#4f8df7', '#36b37e', '#ffab00', '#9b6bdf']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }

    disconnectedCallback() {
        if (this.chart) this.chart.destroy();
    }
}