import { LightningElement } from 'lwc';

export default class QuizApp extends LightningElement {

    selected={} // for storing answers
    correctAnswers = 0 //to show the number of correct answers
    isSubmitted = false // use to show the result
    myQuestions=[
        {
            id:"Question1",
            question:"Which one of the following is not a template loop?",
            answers:{
                a:"for:each",
                b:"iterator",
                c:"map loop"
            },
            correctAnswer:"c"
        },
        
        {
            id:"Question2",
            question:"Which of the file is invald in LWC component folder?",
            answers:{
                a:".svg",
                b:".apex",
                c:".js"
            },
            correctAnswer:"b"
        },
        {
            id:"Question3",
            question:"WHich one of the following is not a directive?",
            answers:{
                a:"for:each",
                b:"if:true",
                c:"@track"
            },
            correctAnswer:"c"
        },
        {
            id:"Question4",
            question:"What is the value of 5+7?",
            answers:{
                a:"10",
                b:"12",
                c:"14"
            },
            correctAnswer:"b"
        },
        {
            id:"Question5",
            question:"Who was the first Prime Minister of India?",
            answers:{
                a:"Indira Gandhi",
                b:"Jawaharlal Nehru",
                c:"Rajiv Gandhi"
            },
            correctAnswer:"b"
        },
        {
            id:"Question6",
            question:"What is the capital of India?",
            answers:{
                a:"New Delhi",
                b:"Mumbai",
                c:"Bangalore"
            },
            correctAnswer:"a"
        }
    ]

    //used for disabling the sumbmit button
    get allNotSelected(){
        return !(Object.keys(this.selected).length === this.myQuestions.length)
    }

    // for applying dynamic styling to our result
    get isScoredFull(){
        return `slds-text-heading_large ${this.myQuestions.length === this.correctAnswers?
            'slds-text-color_success':'slds-text-color_error'}`
    }
    // changeHandler get's called on every click on the options
    changeHandler(event){
        const {name, value} = event.target 
        this.selected={...this.selected, [name]:value}
    }
    //form submit handler
    submitHandler(event){
        event.preventDefault()
        let correct = this.myQuestions.filter(item=>this.selected[item.id] === item.correctAnswer)
        this.correctAnswers = correct.length
        this.isSubmitted = true
    }
    //form reset handler
    resetHandler(){
        this.selected ={}
        this.correctAnswers=0
        this.isSubmitted = false
    }
}