public with sharing class EmployeeController {

    @AuraEnabled(cacheable=true)
    public static List<Employee1__c> getEmployees() {

        return [
            SELECT Id,
                   Name,
                   Employee_Number__c,
                   Email__c,
                   Department__c,
                   Designation__c
            FROM Employee1__c
            ORDER BY CreatedDate DESC
            LIMIT 200
        ];
    }
}

