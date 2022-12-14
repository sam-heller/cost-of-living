import NumbeoCitySearch from "../numbeo/CitySearch"
export default class City {

    constructor(data, prices = {}) {
        this.id = data.id
        this.name = data.name || ''
        this.region = data.region || ''
        this.country = data.country || ''
        this.numbeo_id = data.numbeo_id || 0
        this.prices = prices
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            region: this.region,
            country: this.country,
            numbeo_id: this.numbeo_id,
            prices: this.prices
        }
    }

    async loadNumbeoID() {
        let search = new NumbeoCitySearch()
        this.numbeo_id = await search.find(this)
    }

    async saveNumbeoId(db) {
        let updated = await db
            .prepare("UPDATE City SET numbeo_id = ? WHERE id = ?")
            .bind(this.numbeo_id, this.id)
            .run()
        if (!updated.success) console.log(updated.error)
    }

    async savePrices(db) {
        let insert = "INSERT OR IGNORE INTO Price (`city_id`, `category`, `name`, `average_price`, `lower_pricerange`, `upper_pricerange`) VALUES(?, ?, ?, ?, ?, ?)"
        for (let i of this.prices) {
            let updated = await db
                .prepare(insert)
                .bind(this.id, i.category, i.item, i.average, i.low, i.high)
                .run()
            if (!updated.success) console.log(updated.error)
        }
        console.log(`Updated ${this.id} with ${this.prices.length} records`)
    }
}