import { LightningElement } from 'lwc';

export default class ChildComponent1 extends LightningElement {
    firstname='';
    lastname='';

    handleChangeFirstName(event)
    {
        this.firstname=event.target.value; 
    }
    handleChangeLastName(event)
    {
        this.lastname=event.target.value;
    }

    handleClick(event)
    {
        const searchEvent=new CustomEvent('getsearchevent',
        {detail:{FirstName:this.firstname,
                LastName:this.lastname
                }
        
        });

        this.dispatchEvent(searchEvent);
    }
}
