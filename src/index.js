import { json, text } from 'itty-router-extras'
import { withDecodedParams } from './lib/withDecodedParams';
import { Router } from 'itty-router';
import CityList from './city/list.js';
import CityDetails from './city/details.js';
const router = new Router()

router.get('/id/:id', withDecodedParams, async({ id }, env, ctx) => {
    let details = new CityDetails(env);
    let city = await details.withId(id)
    return json(city)
})

router.get('/search/:query', withDecodedParams, async({ query }, env, ctx) => {
    let details = new CityDetails(env);
    const results = await details.startsWith(query)
    return json(results)
})

router.get('/populate-db', withDecodedParams, async(req, env, ctx) => {
    let cl = new CityList(env);
    const resp = await cl.populateDB();
    return text(resp)
})

const getDataForSomeRandomCity = async(env) => {
    let cd = new CityDetails(env);
    const deets = await cd.random()
    console.log("Loaded Details for random city", deets)
    return deets
}

export default {
    async scheduled(event, env, ctx) { ctx.waitUntil(getDataForSomeRandomCity(env)) },
    fetch: router.handle // yep, it's this easy.
}