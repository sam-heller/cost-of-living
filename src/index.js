import { json, text } from 'itty-router-extras'
import { withDecodedParams } from './lib/withDecodedParams';
import { Router } from 'itty-router';
import CityFactory from './city/Factory.js';
import MapPage from './lib/MapPage';
const router = new Router()

router.get('/favicon.ico', () => {
    return new Response()
})

router.get('/id/:id', withDecodedParams, async({ id }, env, ctx) => {
    let factory = new CityFactory(env)
    let city = await factory.fromId(id)
    return json(city)
})

router.get('/rent/:format', withDecodedParams, async( req, env, ctx)=>{
    let sql = "SELECT City.name as city, City.region as state, Price.average_price FROM Price LEFT JOIN City ON City.id = Price.city_id WHERE category='Rent Per Month' AND Price.name LIKE '%1 bedroom%in City%'"
    let results = await env.COL_DB.prepare(sql).bind().all()
    if (format == 'json') return json(results.results)

    let csv = ['City,State,Price']
    for (let r of results.results){
        csv.push(`${r.city},${r.state},${r.average_price.replaceAll(',', '')}`)
    }
    return text(csv.join("\n"))
})

router.get('/for-map', withDecodedParams, async(req, env, ctx) => {
    let factory = new CityFactory(env)
    let data = await factory.forMap()
    return json(data)
})

router.get('/', ({res, env, ctx}) => {
    let mp = new MapPage()
    return new Response(mp.markup(), {  headers: {'content-type': 'text/html;charset=UTF-8'}})
})


const getDataForSomeRandomCity = async(env) => {
    // return await enrichLocation(env)
}


// run in the getData method to run loader for lat/long data
const enrichLocation = async (env, iterations=50) => {
    let factory = new CityFactory(env)
    for (let x=0;x<=iterations;x++){
        let rand = await factory.randomWithoutLatlong()
        let loc = await rand.geoCode(env.api_ninja_key, env.COL_DB)
    }
}

// call in the getData method to run loader for unpopulated prices
const enrichPrice = async (env, iterations=5) => {
    let factory = new CityFactory(env)
    for (let x=0;x<=iterations;x++){
        let rand = await factory.randomUnpopulated()
    }
}

export default {
    async scheduled(event, env, ctx) { ctx.waitUntil(getDataForSomeRandomCity(env)) },
    fetch: router.handle
}