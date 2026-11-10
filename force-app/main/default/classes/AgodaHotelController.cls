public with sharing class AgodaHotelController {
    @AuraEnabled
    public static String searchRooms(List<Integer> propertyIds, Date checkIn,
        Date checkOut, Integer rooms, Integer adults, Integer children, String currencyCode) {
        if (propertyIds == null || propertyIds.isEmpty())
            throw new AuraHandledException('Provide at least one authorized property ID.');
        if (checkIn == null || checkOut == null || checkOut <= checkIn)
            throw new AuraHandledException('Check-out must be later than check-in.');
        if (rooms == null || rooms < 1 || adults == null || adults < 1 || children == null || children < 0)
            throw new AuraHandledException('Enter valid room and guest counts.');

        Map<String,Object> criteria = new Map<String,Object>{
            'propertyIds' => propertyIds, 'checkIn' => String.valueOf(checkIn),
            'checkOut' => String.valueOf(checkOut), 'rooms' => rooms,
            'adults' => adults, 'children' => children, 'language' => 'en-us',
            'currency' => String.isBlank(currencyCode) ? 'USD' : currencyCode,
            'userCountry' => 'IN'
        };
        Map<String,Object> payload = new Map<String,Object>{
            'waitTime' => 30, 'criteria' => criteria,
            'features' => new Map<String,Object>{'ratesPerProperty' => 5,
                'extra' => new List<String>{'content','rateDetail'}}
        };
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Agoda_API/api/v4/property/availability');
        req.setMethod('POST');
        req.setHeader('Content-Type','application/json');
        req.setTimeout(60000);
        req.setBody(JSON.serialize(payload));
        try {
            HttpResponse res = new Http().send(req);
            if (res.getStatusCode() >= 200 && res.getStatusCode() < 300) return res.getBody();
            throw new AuraHandledException('Hotel provider returned HTTP status ' + res.getStatusCode() + '.');
        } catch (AuraHandledException e) {
            throw e;
        } catch (Exception e) {
            throw new AuraHandledException('Hotel availability request failed. Check Named Credential and API configuration.');
        }
    }
}
