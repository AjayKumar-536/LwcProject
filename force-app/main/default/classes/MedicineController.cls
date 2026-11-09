public with sharing class MedicineController {
    @AuraEnabled(cacheable=true)
    public static List<Medicine__c> getMedicines(String searchKey) {
        String key = String.isBlank(searchKey) ? '%' : '%' + searchKey.trim() + '%';
        return [SELECT Id, Name, Code__c, Unit_Price__c, Stock_Quantity__c,
                       Expiry_Date__c, Active__c
                FROM Medicine__c WHERE Name LIKE :key OR Code__c LIKE :key
                ORDER BY Name LIMIT 200];
    }
    @AuraEnabled
    public static Id saveMedicine(Medicine__c medicineRecord) {
        if (medicineRecord == null || String.isBlank(medicineRecord.Name))
            throw new AuraHandledException('Medicine name is required.');
        if (medicineRecord.Stock_Quantity__c != null && medicineRecord.Stock_Quantity__c < 0)
            throw new AuraHandledException('Stock cannot be negative.');
        upsert medicineRecord;
        return medicineRecord.Id;
    }
}
