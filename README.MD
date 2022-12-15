# cost-of-living
API for a subset of the numbero.com cost of living dataset. This is mostly just an excuse to play around with Cloudflares D1 while it's in alpha, and definitely isn't meant as a finished product.


## Database Setup
```bash
wrangler d1 execute cost-of-living --file=./schema/city.sql 
wrangler d1 execute cost-of-living --file=./schema/details.sql 
```
There's a cron job tasked to run every minute to populate the data for a single city, but you can force population for a specific city by hitting the `/id/:id` or `/search/:query` endpoint 

## Secrets
Uses the reverse-geocode API from api-ninjas.com, free tier gives you 50k requests/month, which is more than what's needed, [register](https://api-ninjas.com/register) and get an api key and then add it as a secret with wrangler 
```bash
(base) cost-of-living|main⚡ ⇒ wrangler secret put api_ninja_key
 ⛅️ wrangler 2.1.9 (update available 2.6.2)
-----------------------------------------------------
Enter a secret value: **************************************** 
🌀 Creating the secret for the Worker "cost-of-living" 
✨ Success! Uploaded secret api_ninja_key
(base) cost-of-living|main⚡ ⇒ 
```
