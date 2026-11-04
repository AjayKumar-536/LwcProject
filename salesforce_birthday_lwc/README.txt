SALESFORCE LWC: BIRTHDAY SURPRISE

Included:
- birthdaySurprise.html
- birthdaySurprise.js
- birthdaySurprise.css
- birthdaySurprise.js-meta.xml

DEPLOY
1. Unzip the project files.
2. Copy the birthdaySurprise folder into your Salesforce DX project's:
   force-app/main/default/lwc/
3. Open the project in VS Code with Salesforce Extension Pack installed.
4. Connect to your Salesforce org (Command Palette > SFDX: Authorize an Org).
5. Right-click the birthdaySurprise folder and select SFDX: Deploy Source to Org.

PUBLISH ON EXPERIENCE CLOUD
1. In Salesforce Setup, search for Digital Experiences and enable it if needed.
2. Create or open an Experience Cloud site.
3. Open Experience Builder.
4. Find "Birthday Surprise" in the Components panel and drag it onto the page.
5. Set the recipient name, your name, message, and optional video URL in the component properties.
6. Publish the site.
7. Open the published page in a private/incognito browser or phone to test its guest access.

IMPORTANT ACCESS NOTES
- If the site asks visitors to log in, review the site's guest/public access settings and permissions. Do not grant broad access to Salesforce records just to show a greeting page.
- Use only photos and videos you have permission to share.
- The optional video link opens in a new tab. A public, accessible URL is needed.
- QR CODE: After publishing, copy the public page URL and create a QR code using a trusted QR-code generator. Download the QR image and test it with a phone before sharing.
- If your Salesforce org does not support Experience Cloud or your permissions are limited, ask your Salesforce admin to enable the required feature and grant deployment/site-builder access.

CUSTOMIZATION
Edit the defaults in birthdaySurprise.js or set the properties in Experience Builder. The message reveal button works on the page without Apex or a database.
