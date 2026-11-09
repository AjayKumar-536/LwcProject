public with sharing class BillingController {
    @AuraEnabled(cacheable=true)
    public static List<Bills__c> getBills() {
        return [SELECT Id, Name, Patient__c, Patient__r.Name, Appointment__c,
                       Bill_Date__c, Amount__c, Payment_Status__c
                FROM Bills__c ORDER BY CreatedDate DESC LIMIT 200];
    }
    @AuraEnabled
    public static Id saveBill(Bills__c billRecord) {
        if (billRecord == null || billRecord.Patient__c == null || billRecord.Amount__c == null ||
            billRecord.Amount__c < 0)
            throw new AuraHandledException('Patient and a valid bill amount are required.');
        upsert billRecord;
        return billRecord.Id;
    }
}
