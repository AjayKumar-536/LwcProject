public with sharing class AccountClass {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchTextClass){
        try {
            if(String.isEmpty(searchTextClass))
            {
            return [SELECT Id, Name FROM Account];
            }
            else 
            {
                searchTextClass='%'+searchTextClass+'%';
                return [SELECT Id, Name FROM Account WHERE Name Like :searchTextClass];
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Contact> getAccountContacts(String accountId){
        try {
            return [SELECT Id, Name FROM Contact WHERE accountId= :accountId];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}