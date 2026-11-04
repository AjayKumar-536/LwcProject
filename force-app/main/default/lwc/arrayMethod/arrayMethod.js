import { LightningElement } from 'lwc';

export default class ArrayMethod extends LightningElement {
    arr = [1, 2, 3, 4, 5]
    newArr = this.arr.map((item) => item * 2)

}