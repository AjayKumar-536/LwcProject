import { LightningElement, wire, api } from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets'
 import {getRecord, getFieldValue} from 'lightning/uiRecordApi'
import FULLNAME from '@salesforce/schema/Portfolio__c.FullName__c'
import COMPANY_LOCATION from '@salesforce/schema/Portfolio__c.CompanyLocation__c'
import COMPANY_NAME from '@salesforce/schema/Portfolio__c.CompanyName__c'
import DESIGNATION from '@salesforce/schema/Portfolio__c.Designation__c'


export default class PortfolioBanner extends LightningElement {
    @api recordId //= 'a0Pbm000009ql2TEAQ'
    @api linkedinUrl //= 'https://www.linkedin.com/in/ajay-kumar-sakhapuram/'
    @api twitterUrl //= 'https://x.com/AjayKumar5362'
    @api githubUrl //= 'https://github.com/AjayKumar-536'
    @api youtubeUrl //= 'https://www.youtube.com/@AjayTheAchiever'
    @api trailheadUrl //= 'https://trailblazer.me/id/bkarkra'
    @api blogUrl //= 'https://ajay-dev-ed.develop.my.site.com/portfolioofajay'


    userPic = `${PortfolioAssets}/PortfolioAssets/userPic.jpeg`
    linkedin = `${PortfolioAssets}/PortfolioAssets/Social/linkedin.svg`
    youtube = `${PortfolioAssets}/PortfolioAssets/Social/youtube.svg`
    github = `${PortfolioAssets}/PortfolioAssets/Social/github.svg`
    twitter = `${PortfolioAssets}/PortfolioAssets/Social/twitter.svg`
    trailhead = `${PortfolioAssets}/PortfolioAssets/Social/trailhead1.svg`
    blog = `${PortfolioAssets}/PortfolioAssets/Social/blogger.svg`

    
    @wire(getRecord, {recordId:'$recordId', fields:[FULLNAME,COMPANY_LOCATION,COMPANY_NAME,DESIGNATION]})
    portfolioData
    // portfolioHandler({data, error}){
    //     if(data){
    //         console.log("record Data", JSON.stringify(data))
    //     }
    //     if(error){
    //         console.error("error", error)
    //     }
    // }

    get fullName(){
        return getFieldValue(this.portfolioData.data, FULLNAME)
    }
    get companyLocation(){
        return getFieldValue(this.portfolioData.data, COMPANY_LOCATION)
    }
    get companyName(){
        return getFieldValue(this.portfolioData.data, COMPANY_NAME)
    }
    get designation(){
        return getFieldValue(this.portfolioData.data, DESIGNATION)
    }

}