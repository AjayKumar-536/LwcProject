import { LightningElement } from 'lwc';

export default class ForEachLoop extends LightningElement {
    employee={
            Fname: 'Ajay',
            Lname: 'Sakhapuram',
            Age: 25,
            City: 'Hyderabad'
        }
    employeeList=[{Fname: 'Ajay',
            Lname: 'Sakhapuram',
            Age: 25,
            City: 'Hyderabad'},
        {
            Fname: 'Rajesh',
            Lname: 'Sannu',
            Age: 26,
            City: 'Bangalore'
        },
        {
            Fname: 'Mahendra',
            Lname: 'Botta',
            Age: 24,
            City: 'Chennai'
}]
}