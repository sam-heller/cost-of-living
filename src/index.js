// import { Router } from 'itty-router'
import { json, error } from 'itty-router-extras'
import { withDecodedParams } from './lib/withDecodedParams';
import { Router } from 'itty-router';
import CityCache from './city/list';
const router = new Router()

router.get('/city-list', async() => {
    let cities = await new CityCache().buildCityList()
    return json(cities)
})

router.get('/:country/:city', withDecodedParams, async({ country, city }) => {
    if (!['USA', 'US'].includes(country.toUpperCase())) {
        return error(501, "Only Supports US Cities at the moment, sry")
    }
    const results = await COST_OF_LIVING.list({ prefix: city.toLowerCase() });
    let keys = results.keys.map((e) => e.name)
    let type = keys.length === 1 ? 'city' : 'list'
    let data = type == 'city' ? await COST_OF_LIVING.get(keys[0], { type: 'json' }) : keys
    return json({ 'type': type, 'data': data })
})


addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request))
})