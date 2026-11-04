import { LightningElement } from 'lwc';

export default class Maps extends LightningElement {
    mapMarkers = [
        {
            location: { City: 'Nellore', Country: 'India' },
            title: 'Nellore',
            description: 'Example location marker'
        },
        {
            location: { City: 'Kavali', Country: 'India' },
            title: 'Kavali',
            description: 'Another example marker'
        },
        {
            location: { City: 'Atmakur', Country: 'India' },
            title: 'Atmakur',
            description: 'Another example marker'
        },
        {
            location: { City: 'Guntur', Country: 'India' },
            title: 'Guntur',
            description: 'Another example marker'
        }
    ];
}