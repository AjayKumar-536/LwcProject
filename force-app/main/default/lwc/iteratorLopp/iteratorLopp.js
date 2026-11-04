import { LightningElement } from 'lwc';

export default class IteratorLoop extends LightningElement {

    employee={
        Fname:'Parag',
        Lname:'Jambhulkar',
        Age:35,
        City:'Pune'
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

