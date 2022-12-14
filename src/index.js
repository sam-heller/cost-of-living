import { json } from 'itty-router-extras'
import { withDecodedParams } from './lib/withDecodedParams';
import { Router } from 'itty-router';
import CityFactory from './city/factory.js';
const router = new Router()

router.get('/id/:id', withDecodedParams, async({ id }, env, ctx) => {
    let factory = new CityFactory(env)
    let city = await factory.fromId(id)
    return json(city)
})

const getDataForSomeRandomCity = async(env) => {
    let factory = new CityFactory(env)
    await factory.randomUnpopulated()
    await factory.randomUnpopulated()
    await factory.randomUnpopulated()
}

export default {
    async scheduled(event, env, ctx) { ctx.waitUntil(getDataForSomeRandomCity(env)) },
    fetch: router.handle
}