import { LightningElement, wire } from 'lwc';
import getActiveProducts from '@salesforce/apex/VisionzCatalogController.getActiveProducts';
import getActiveCategories from '@salesforce/apex/VisionzCatalogController.getActiveCategories';
import addToCart from '@salesforce/apex/VisionzCommerceController.addToCart';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
export default class VisionzStorefront extends LightningElement {
 products=[];categories=[];searchKey='';selectedCategory='All';errorMessage;wiredProductsResult;
 @wire(getActiveProducts) wiredProducts(r){this.wiredProductsResult=r;if(r.data){this.products=r.data;this.errorMessage=undefined;}else if(r.error)this.errorMessage=r.error.body?.message||'Unable to load products.';}
 @wire(getActiveCategories) wiredCategories({data,error}){if(data)this.categories=data;if(error)this.errorMessage=error.body?.message||'Unable to load categories.';}
 get categoryOptions(){return [{label:'All categories',value:'All'},...this.categories.map(c=>({label:c.Name,value:c.Id}))];}
 get filteredProducts(){let k=this.searchKey.toLowerCase();return this.products.filter(p=>(!k||p.Name.toLowerCase().includes(k)||(p.Description__c||'').toLowerCase().includes(k))&&(this.selectedCategory==='All'||p.Category__c===this.selectedCategory));}
 handleSearch(e){this.searchKey=e.target.value||'';}handleCategory(e){this.selectedCategory=e.detail.value;}
 async handleAddToCart(e){try{await addToCart({productId:e.detail.productId,quantity:1,customerEmail:'demo.customer1@example.com'});this.dispatchEvent(new ShowToastEvent({title:'Added to cart',message:'Demo cart item created.',variant:'success'}));}catch(x){this.dispatchEvent(new ShowToastEvent({title:'Unable to add',message:x.body?.message||x.message,variant:'error'}));}}
 async refreshCatalog(){await refreshApex(this.wiredProductsResult);}
}