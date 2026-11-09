public with sharing class AppointmentController {
    @AuraEnabled(cacheable=true)
    public static List<Appointment__c> getAppointments(Date fromDate, Date toDate) {
        Date startDate = fromDate == null ? Date.today().addDays(-30) : fromDate;
        Date endDate = toDate == null ? Date.today().addDays(90) : toDate;
        return [SELECT Id, Name, Patient__c, Patient__r.Name, Doctor__c, Doctor__r.Name,
                       Appointment_Date__c, Status__c, Reason__c, Fee__c
                FROM Appointment__c
                WHERE Appointment_Date__c >= :DateTime.newInstance(startDate, Time.newInstance(0,0,0,0))
                  AND Appointment_Date__c <= :DateTime.newInstance(endDate, Time.newInstance(23,59,59,999))
                ORDER BY Appointment_Date__c DESC LIMIT 500];
    }
    @AuraEnabled
    public static Id saveAppointment(Appointment__c appointmentRecord) {
        if (appointmentRecord == null || appointmentRecord.Patient__c == null ||
            appointmentRecord.Doctor__c == null || appointmentRecord.Appointment_Date__c == null)
            throw new AuraHandledException('Patient, doctor and appointment date are required.');
        upsert appointmentRecord;
        return appointmentRecord.Id;
    }
    @AuraEnabled
    public static void updateStatus(Id appointmentId, String newStatus) {
        Set<String> allowed = new Set<String>{'Requested','Confirmed','Completed','Cancelled'};
        if (appointmentId == null || !allowed.contains(newStatus))
            throw new AuraHandledException('Invalid appointment or status.');
        update new Appointment__c(Id=appointmentId, Status__c=newStatus);
    }
}
