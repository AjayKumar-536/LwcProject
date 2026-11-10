@IsTest
private class AgodaHotelControllerTest {
    private class AvailabilityMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            System.assertEquals('POST', req.getMethod());
            System.assert(req.getEndpoint().contains('callout:Agoda_API'));
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200); res.setHeader('Content-Type','application/json');
            res.setBody('{"properties":[]}'); return res;
        }
    }
    @IsTest static void returnsMockResponse() {
        Test.setMock(HttpCalloutMock.class, new AvailabilityMock());
        Test.startTest();
        String body = AgodaHotelController.searchRooms(new List<Integer>{12345},
            Date.today().addDays(5), Date.today().addDays(7), 1, 2, 0, 'USD');
        Test.stopTest();
        System.assertEquals('{"properties":[]}', body);
    }
    @IsTest static void validatesMissingProperty() {
        try {
            AgodaHotelController.searchRooms(new List<Integer>(), Date.today().addDays(5),
                Date.today().addDays(7), 1, 2, 0, 'USD');
            System.assert(false, 'Expected validation exception');
        } catch (AuraHandledException expectedException) {
            System.assert(expectedException.getMessage().contains('authorized property ID'));
        }
    }
}
