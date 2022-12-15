const fs = require('fs')
let cities = require('./zillow.js')
for(let zillow of cities){
    zillow.RegionName =  zillow.RegionName.replaceAll(/'/g, ' ');
    let query = `INSERT OR IGNORE INTO City(\`name\`, \`region\`) VALUES("${zillow.RegionName}", "${zillow.State}");\n`
    fs.appendFileSync('./zillow_cities.sql', query)
    query = `INSERT OR IGNORE INTO Price (city_id, category, name, average_price) VALUES( (SELECT id FROM City WHERE name='${zillow.RegionName}' AND region='${zillow.State}'),  'zillow', 'Average Rent', CAST(${zillow.Rent} AS int));\n`
    fs.appendFileSync('./zillow_prices.sql', query )
}






