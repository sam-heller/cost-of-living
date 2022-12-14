# cost-of-living
API for a subset of the numbero.com cost of living dataset. This is mostly just an excuse to play around with Cloudflares D1 while it's in alpha, and definitely isn't meant as a finished product.


## Database Setup
```bash
wrangler d1 execute cost-of-living --file=./schema/city.sql 
wrangler d1 execute cost-of-living --file=./schema/details.sql 
```
There's a cron job tasked to run every minute to populate the data for a single city, but you can force population for a specific city by hitting the `/id/:id` or `/search/:query` endpoint 

