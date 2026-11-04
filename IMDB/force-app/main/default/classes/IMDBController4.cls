public with sharing class IMDBController4 {
    
    @AuraEnabled(cacheable=true)
    public static string getMovies(string searchText){
        try {

        // Create a new HTTP request object
        HttpRequest req = new HttpRequest();
        // Set the endpoint URL of the external service
        //remote site settings
        //req.setEndpoint('https://api.collectapi.com/imdb/imdbSearchByName?query='+searchText);
        //named creadentials
        req.setEndpoint('callout:IMDB/imdb/imdbSearchByName?query='+searchText);
        // Set the HTTP method (GET, POST, etc.)
        req.setMethod('GET');
        // Set any request body if necessary
        // req.setBody('Your request body here');

        // Add any headers needed for the request
        //req.setHeader('Authorization', 'apikey 7wz7vNhq4eqwyYOwK3ulHT:7LDDkJ1luCkLjDAcJ0D5Mv');

        // Create a new HTTP object to send the request
        Http http = new Http();
        try {
            // Send the HTTP request and store the response
            HttpResponse res = http.send(req);

            // Parse and handle the response as needed
            // For example:
            if (res.getStatusCode() == 200) {
                // Successful response
                String responseBody = res.getBody();
                //System.debug(responseBody);
                return responseBody;
                // Process responseBody
            } else {
                // Handle error response
                String errorMessage = 'Error: ' + res.getStatusCode() + ' - ' + res.getStatus();
                return errorMessage;
                // Process errorMessage
            }
        } catch (Exception e) {
            // Handle any exceptions that occur during the HTTP request
            System.debug('Exception occurred: ' + e.getMessage());
            return 'Exception occurred: ' + e.getMessage();
        }

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}