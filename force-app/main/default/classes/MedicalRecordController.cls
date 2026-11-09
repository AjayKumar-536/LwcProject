public with sharing class MedicalRecordController {
    @AuraEnabled(cacheable=true)
    public static List<Medical_Record__c> getRecords(Id patientId) {
        if (patientId == null) return new List<Medical_Record__c>();
        return [SELECT Id, Name, Patient__c, Patient__r.Name, Doctor__c, Doctor__r.Name,
                       Diagnosis__c, Treatment__c, Prescription_Date__c, Instructions__c
                FROM Medical_Record__c WHERE Patient__c = :patientId
                ORDER BY CreatedDate DESC LIMIT 200];
    }
    @AuraEnabled
    public static Id saveRecord(Medical_Record__c recordItem) {
        if (recordItem == null || recordItem.Patient__c == null)
            throw new AuraHandledException('Select a patient before saving a medical record.');
        upsert recordItem;
        return recordItem.Id;
    }
}
