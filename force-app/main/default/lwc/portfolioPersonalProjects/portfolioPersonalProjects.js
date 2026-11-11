import { LightningElement } from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets'
export default class PortfolioPersonalProjects extends LightningElement {
    BMICalculator = `${PortfolioAssets}/PortfolioAssets/Projects/BMICalculator.png`
    AlarmClock = `${PortfolioAssets}/PortfolioAssets/Projects/AlarmClock.png`
    CurrencyCalculator = `${PortfolioAssets}/PortfolioAssets/Projects/CurrencyCalculator.png`
    WeatherApp = `${PortfolioAssets}/PortfolioAssets/Projects/WeatherApp.png`
    SurveyApp = `${PortfolioAssets}/PortfolioAssets/Projects/Survey.png`
    NoteApp = `${PortfolioAssets}/PortfolioAssets/Projects/NoteTakingApp.png`

    projects=[
        {
            "name":"BMI Calculator App",
            "img":this.BMICalculator,
            "link":"https://ajay-dev-ed.develop.my.site.com/bmi-calculator-app"
        },
        {
            "name":"Alarm Clock App",
            "img":this.AlarmClock,
            "link":"https://ajay-dev-ed.develop.my.site.com/alarm-clock-app"
        },
        {
            "name":"Curreny Converter App",
            "img":this.CurrencyCalculator,
            "link":"https://ajay-dev-ed.develop.my.site.com/currency-converter-app"
        }
    ]
}