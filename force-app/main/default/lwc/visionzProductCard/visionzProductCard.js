import { LightningElement, api } from 'lwc';
export default class VisionzProductCard extends LightningElement {
 @api product;get imageUrl(){return this.product?.Image_URL__c||'/resource/VisionzAssets/product-placeholder.svg';}
 get formattedPrice(){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(this.product?.Price__c||0);}
 addToCart(){this.dispatchEvent(new CustomEvent('addtocart',{detail:{productId:this.product.Id}}));}
}