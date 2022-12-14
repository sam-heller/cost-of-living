import City from "./city.js"
import NumbeoDetailsScraper from "../numbeo/DetailsScraper"

export default class CityFactory {
    constructor(env) {
        this.db = env.COL_DB
    }

    async fromId(id, withDetails = true) {
        let data = await this.cityData(id)
        if (!withDetails) return new City(data)

        let prices = await this.detailsData(id)
        if (prices.length >= 1) return new City(data, prices)

        let city = new City(data)
        if (city.numbeo_id == 0) {
            await city.loadNumbeoID()
            await city.saveNumbeoId(this.db)
        }

        let scraper = new NumbeoDetailsScraper()
        city.prices = await scraper.scrapeDetails(city)

        await city.savePrices(this.db)
        return city
    }

    async randomUnpopulated() {
        const stmt = this.db.prepare(`SELECT id FROM City WHERE numbeo_id == 0 ORDER BY RANDOM() LIMIT 1`)
        const id = await stmt.first('id')
        return await this.fromId(id)
    }

    async cityData(id) {
        return await this.db.prepare("SELECT * FROM City WHERE id = ?").bind(id).first()

    }

    async detailsData(id) {
        let details = await this.db.prepare("SELECT * FROM Price WHERE city_id = ?").bind(id).all()
        return details.results ? details.results : []
    }
}