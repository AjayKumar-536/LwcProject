public with sharing class PatientController {
    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatients(String searchKey) {
        String key = String.isBlank(searchKey) ? '%' : '%' + searchKey.trim() + '%';
        return [SELECT Id, Name, Email__c, Phone__c, Gender__c, Blood_Group__c,
                       Date_of_Birth__c, CreatedDate
                FROM Patient__c
                WHERE Name LIKE :key OR Email__c LIKE :key OR Phone__c LIKE :key
                ORDER BY CreatedDate DESC LIMIT 200];
    }

    @AuraEnabled
    public static Id savePatient(Patient__c patientRecord) {
        if (patientRecord == null || String.isBlank(patientRecord.Name)) {
            throw new AuraHandledException('Patient name is required.');
        }
        upsert patientRecord;
        return patientRecord.Id;
    }

    @AuraEnabled
    public static void deletePatient(Id patientId) {
        if (patientId == null) throw new AuraHandledException('Patient ID is required.');
        delete [SELECT Id FROM Patient__c WHERE Id = :patientId LIMIT 1];
    }
}
