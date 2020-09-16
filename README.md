# roofCatcher

For all the poor and desperate souls, looking for student housing in Paris.

This is a small toy project that scraps the web and send you alerts whenever new accomodations are availbale in CROUS or ARPEJ. 
You can write you own handlers for other residencies.

Current support: 
- Residencies :
    - Arpej
    - CROUS
- Alerts :
    - FB Messenger API
    - Email alerts soon.

Make sure to edit the values in the .env file with your own:
  - SECRET_TOKEN : This is the page secret token generated on your facebook app 
  - VERIFY_TOKEN : The value to verify your webhook the first time.
  - RECIPIENT_PSID : The id of the alerts recipient.
  - PORT : Port of the web server (when varifying webhooks)
    
  (The variables above are only needed if you want to receive the alerts on FB Messenger)
  
  - INTERVAL : Number of minutes at which the server triggers another batch of requests.
  
I recommend deploying on Heroku for quick results. Add the following buildpack to your deno to run Puppeteer.
https://github.com/jontewks/puppeteer-heroku-buildpack
