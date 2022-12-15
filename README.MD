# cost-of-living
Smooshing together a bunch of cost of living/rental cost information. This is mostly just an excuse to play around with Cloudflares D1 while it's in alpha, and definitely isn't meant as a finished product.

## Database Setup
### Build Table Structure
```bash
wrangler d1 execute cost-of-living --file=./schema/tables.sql 
```
### Load Zillow Data 
Zillow has a [bunch of data](https://www.zillow.com/research/data/) avaiable for download. I've pulled the ZORI dataset with the following options, and massaged it with openrefine.

| Data Type | Geography | 
| -- | -- | 
| ZORI (Smoothed): All Homes Plus Multifamily Time Series ($)  | City | 

running it is straightforward 
```bash
(base) cost-of-living|main⚡ ⇒ node ./build_zillow.js                                                                                       
(base) cost-of-living|main⚡ ⇒ wrangler d1 execute cost-of-living --file ./zillow_cities.sql                      
Executing on cost-of-living (9e0ca535-2863-4022-aaf9-ee5c35313f0c):
Executed command in ms.
(base) cost-of-living|main⚡ ⇒ wrangler d1 execute cost-of-living --file ./zillow_prices.sql
Executing on cost-of-living (9e0ca535-2863-4022-aaf9-ee5c35313f0c):
Executed command in ms.
```
### Numbeo Data

The Numbeo Data is pulled in in incrementally via a cron job running once a minute that is enabled by default, check out the `enrichDataHandler()` method in index.js.

### Location Data
Latitude/Longitude info for the points is pulled down from the reverse-geocode API from api-ninjas.com, free tier gives you 50k requests/month, which is more than what's needed, [register](https://api-ninjas.com/register) and get an api key and then add it as a secret with wrangler 
```bash
(base) cost-of-living|main⚡ ⇒ wrangler secret put api_ninja_key
 ⛅️ wrangler 2.1.9 (update available 2.6.2)
-----------------------------------------------------
Enter a secret value: **************************************** 
🌀 Creating the secret for the Worker "cost-of-living" 
✨ Success! Uploaded secret api_ninja_key
(base) cost-of-living|main⚡ ⇒ 
```
This is also invoked from the  `enrichDataHandler()` method in the index.js
