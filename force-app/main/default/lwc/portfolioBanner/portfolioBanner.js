import { LightningElement } from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets'
export default class PortfolioBanner extends LightningElement {

    linkedinUrl = 'https://www.linkedin.com/in/nikhilkarkra'
    twitterUrl = 'https://twitter.com/karkra_nikhil'
    githubUrl = 'https://github.com/karkranikhil'
    youtubeUrl = 'https://youtube.com/salesforcetroop'
    trailheadUrl = 'https://trailblazer.me/id/bkarkra'
    blogUrl = 'https://www.salesforcetroop.com/'


    userPic = `${PortfolioAssets}/PortfolioAssets/userPic.jpeg`
    linkedin = `${PortfolioAssets}/PortfolioAssets/Social/linkedin.svg`
    youtube = `${PortfolioAssets}/PortfolioAssets/Social/youtube.svg`
    github = `${PortfolioAssets}/PortfolioAssets/Social/github.svg`
    twitter = `${PortfolioAssets}/PortfolioAssets/Social/twitter.svg`
    trailhead = `${PortfolioAssets}/PortfolioAssets/Social/trailhead1.svg`
    blog = `${PortfolioAssets}/PortfolioAssets/Social/blogger.svg`

}