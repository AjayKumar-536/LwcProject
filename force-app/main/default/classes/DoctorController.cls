public with sharing class DoctorController {
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getDoctors(String searchKey) {
        String key = String.isBlank(searchKey) ? '%' : '%' + searchKey.trim() + '%';
        return [SELECT Id, Name, Specialization__c, Phone__c, Email__c, Fee__c,
                       Active__c, Department__c, Department__r.Name
                FROM Doctor__c WHERE Name LIKE :key OR Specialization__c LIKE :key
                ORDER BY Name LIMIT 200];
    }
    @AuraEnabled
    public static Id saveDoctor(Doctor__c doctorRecord) {
        if (doctorRecord == null || String.isBlank(doctorRecord.Name))
            throw new AuraHandledException('Doctor name is required.');
        upsert doctorRecord;
        return doctorRecord.Id;
    }
}
