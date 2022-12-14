export default class CityDetails {
    constructor(env) {
        this.search = 'https://www.numbeo.com/common/CitySearchJson'
        this.db = env.COL_DB
        this.detailRedirect = 'https://www.numbeo.com/common/dispatcher.jsp'
        this.detailPrefix = 'https://www.numbeo.com/cost-of-living/in/'
        this.detailStart = '<table class="data_wide_table new_bar_table">'
        this.detailEnd = '</table>'
    }

    async startsWith(searchTerm) {
        const resp = await this.db.prepare("SELECT * FROM City WHERE name LIKE ?").bind(`${searchTerm}%`).all()
        let results = []
        console.log(resp.results)
        for (let city of resp.results) {
            city = await this.setNumbeoID(city)
                //Only pull details in if we're loading a single record
            if (resp.results.length == 1) {
                city = await this.priceDetails(city)
            }
            results.push(city)
        }
        return results
    }

    async random() {
        const resp = await this.db.prepare("SELECT id FROM City ORDER BY RANDOM() LIMIT 1").all()
        return await this.withId(resp.results[0].id)
    }

    async withId(id) {
        const resp = await this.db.prepare("SELECT * FROM City WHERE id = ?").bind(id).all()
        let city = await this.setNumbeoID(resp.results[0])
        city.prices = await this.priceDetails(city)
        return city
    }

    async getDetailsFromDB(city_id) {
        let results = await this.db.prepare("SELECT * FROM Price WHERE city_id = ?").bind(city_id).all()
        console.log(results)
        return results.results
    }

    async priceDetails(city) {
        city.prices = await this.getDetailsFromDB(city.id)
        if (city.prices.length > 0) { return city }
        let search = new URL(this.detailRedirect)
        search.searchParams.set('city_id', city.numbeo_id)
        search.searchParams.set('where', this.detailPrefix)
        let result = await fetch(search.href)
        let data = await result.text()
        data = await this.parseDetailsPage(data)
        console.log("Data is now", data)
        for (let item of data) {
            let updated = await this.db
                .prepare("INSERT INTO Price (`city_id`, `category`, `name`, `average_price`, `lower_pricerange`, `upper_pricerange`) VALUES(?, ?, ?, ?, ?, ?)")
                .bind(city.id, item.category, item.item, item.average, item.range[0], item.range[1])
                .run()
            console.log("Updated", updated, [city.id, item.category, item.name, item.average, item.range])
        }
        city.prices = this.getDetailsFromDB(city.id)
        return city
    }

    async parseDetailsPage(data) {
        let responded = []
        let currentKey = ""
        let startPos = data.indexOf(this.detailStart) + this.detailStart.length
        data = data.substring(startPos)
        let endPos = data.indexOf(this.detailEnd)
        data = data.substring(0, endPos)
        data = data.split("<tr>")
        for (let row of data) {
            row = row.split('</td>')
            row = row.map((e) => e.replaceAll(/<.*?>/g, '').trim())
                .map((e) => e.replaceAll(/&nbsp;/g, ' '))
                .map((e) => e.replaceAll(/&#36;/g, ''))
                .map((e) => e.trim())
                .filter((e) => e.length > 0)

            if (row.length == 1) {
                currentKey = row[0]
                currentKey = currentKey.substring(0, currentKey.indexOf('Edit'))
                currentKey = currentKey.trim()
            } else if (row.length == 3) {
                responded.push({
                    category: currentKey,
                    item: row[0],
                    average: row[1],
                    range: row[2].split('-')
                })
            }

        }
        return responded
    }



    async setNumbeoID(city) {
        if (city.numbeo_id == 0 || city.numbeo_id == null) {
            let search = new URL(this.search)
            search.searchParams.set('term', `${city.name}, ${city.region}`)
            let data = await fetch(search.href).then((e) => e.json())
            console.log(data)
            let updated = await this.db
                .prepare("UPDATE City SET numbeo_id = ? WHERE id = ?")
                .bind(data[0].value, city.id).run()
            console.log("Updated", updated)
            let res = await this.db
                .prepare("SELECT * FROM City WHERE id = ?")
                .bind(city.id)
                .all()
            city = res.results[0]
        }

        return city
    }

}