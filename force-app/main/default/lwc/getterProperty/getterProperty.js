import { LightningElement } from 'lwc';

export default class HelloWorld extends LightningElement {
    employee={
        Fname:'Ajay Kumar',
        Lname:'sakhapuram',
        Age:24,
        City:'Nellore'
        }

        get getEmployeeRank()
        {
            const rank = this.employee.Age>=50?'One':this.employee.Age>30?'Second':'Third';
            return rank;
        }
}

