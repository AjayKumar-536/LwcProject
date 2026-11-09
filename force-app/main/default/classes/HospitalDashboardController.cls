public with sharing class HospitalDashboardController {
    public class DashboardData {
        @AuraEnabled public Integer patients;
        @AuraEnabled public Integer doctors;
        @AuraEnabled public Integer appointmentsToday;
        @AuraEnabled public Integer pendingAppointments;
        @AuraEnabled public Integer lowStockMedicines;
    }
    @AuraEnabled(cacheable=true)
    public static DashboardData getDashboardData() {
        DashboardData d = new DashboardData();
        d.patients = [SELECT COUNT() FROM Patient__c];
        d.doctors = [SELECT COUNT() FROM Doctor__c WHERE Active__c = true];
        DateTime startToday = DateTime.newInstance(Date.today(), Time.newInstance(0,0,0,0));
        DateTime endToday = startToday.addDays(1);
        d.appointmentsToday = [SELECT COUNT() FROM Appointment__c
            WHERE Appointment_Date__c >= :startToday AND Appointment_Date__c < :endToday];
        d.pendingAppointments = [SELECT COUNT() FROM Appointment__c
            WHERE Status__c IN ('Requested','Confirmed')];
        d.lowStockMedicines = [SELECT COUNT() FROM Medicine__c
            WHERE Active__c = true AND Stock_Quantity__c <= 10];
        return d;
    }
}
