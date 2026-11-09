public with sharing class PrescriptionController {
    @AuraEnabled(cacheable=true)
    public static List<Prescription_Medicine__c> getPrescriptionItems(Id medicalRecordId) {
        if (medicalRecordId == null) return new List<Prescription_Medicine__c>();
        return [SELECT Id, Name, Medical_Record__c, Medicine__c, Medicine__r.Name,
                       Quantity__c, Dosage__c, Duration__c
                FROM Prescription_Medicine__c
                WHERE Medical_Record__c = :medicalRecordId
                ORDER BY CreatedDate DESC LIMIT 200];
    }
    @AuraEnabled
    public static Id savePrescriptionItem(Prescription_Medicine__c item) {
        if (item == null || item.Medical_Record__c == null || item.Medicine__c == null)
            throw new AuraHandledException('Medical record and medicine are required.');
        if (item.Quantity__c == null || item.Quantity__c <= 0)
            throw new AuraHandledException('Quantity must be greater than zero.');
        upsert item;
        return item.Id;
    }
}
