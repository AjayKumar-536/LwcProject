@IsTest
private class HospitalControllersTest {
    @TestSetup
    static void setupData() {
        Department__c dept = new Department__c(Name='Cardiology', Code__c='CARD', Location__c='Block A');
        insert dept;
        Doctor__c doc = new Doctor__c(Name='Dr Test', Specialization__c='Cardiology',
            Email__c='doctor@example.com', Active__c=true, Department__c=dept.Id, Fee__c=500);
        insert doc;
        Patient__c pat = new Patient__c(Name='Test Patient', Email__c='patient@example.com',
            Phone__c='9000000000', Gender__c='Male', Blood_Group__c='O+');
        insert pat;
        insert new Medicine__c(Name='Test Medicine', Code__c='MED-1',
            Stock_Quantity__c=5, Unit_Price__c=10, Active__c=true);
    }
    @IsTest static void patientAndDashboardTests() {
        Test.startTest();
        System.assertEquals(1, PatientController.getPatients('Test').size());
        System.assertNotEquals(null, HospitalDashboardController.getDashboardData());
        Test.stopTest();
    }
    @IsTest static void doctorAndMedicineTests() {
        Test.startTest();
        System.assertEquals(1, DoctorController.getDoctors('Dr').size());
        System.assertEquals(1, MedicineController.getMedicines('Test').size());
        Test.stopTest();
    }
}
