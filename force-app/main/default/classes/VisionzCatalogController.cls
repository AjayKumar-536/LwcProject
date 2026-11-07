public with sharing class VisionzCatalogController {
 @AuraEnabled(cacheable=true) public static List<Product__c> getActiveProducts(){return [SELECT Id,Name,SKU__c,Description__c,Price__c,Stock_Quantity__c,Image_URL__c,Category__c,Category__r.Name FROM Product__c WHERE Is_Active__c=true ORDER BY Name LIMIT 200];}
 @AuraEnabled(cacheable=true) public static List<Category__c> getActiveCategories(){return [SELECT Id,Name,Description__c FROM Category__c WHERE Is_Active__c=true ORDER BY Name];}
}