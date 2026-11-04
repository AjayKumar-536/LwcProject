import { LightningElement, track } from 'lwc';

export default class HelloWorld extends LightningElement {

    fullname="Zero To Hero"
    title ="aura"
    changeHandler(event){
        this.title = event.target.value
    }

   
    @track address={
        city:'Nellore',
        postcode:524322,
        country:'India'
    }
    trackHandler(event){
        this.address.city = event.target.value
    }

   
    users = ["Ajay", "Rajesh", "Mahendra"]
    num1 = 10
    num2 = 20

    get firstUser(){
        return this.users[0].toUpperCase()
    }

    get multiply(){
        return this.num1*this.num2
    }

}