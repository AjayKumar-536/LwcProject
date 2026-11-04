public with sharing class AccountContactTreeController {

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getAccountsWithContacts() {
        List<Account> accounts = [
            SELECT Id, Name, Phone, Website,
                (
                    SELECT Id, Name, Phone
                    FROM Contacts
                    ORDER BY Name
                )
            FROM Account
            WITH USER_MODE
            ORDER BY Name
            LIMIT 100
        ];

        List<Map<String, Object>> results = new List<Map<String, Object>>();

        for (Account acc : accounts) {
            List<Map<String, Object>> contactNodes =
                new List<Map<String, Object>>();

            for (Contact con : acc.Contacts) {
                contactNodes.add(new Map<String, Object>{
                    'id' => String.valueOf(con.Id),
                    'name' => con.Name,
                    'phone' => con.Phone,
                    'website' => null
                });
            }

            results.add(new Map<String, Object>{
                'id' => String.valueOf(acc.Id),
                'name' => acc.Name,
                'phone' => acc.Phone,
                'website' => acc.Website,
                '_children' => contactNodes
            });
        }

        return results;
    }
}
