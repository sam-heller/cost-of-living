import Scraper from "../lib/Scraper"

export default class NumbeoDetailsScraper {
    constructor() {
        this.detailRedirect = 'https://www.numbeo.com/common/dispatcher.jsp'
        this.detailPrefix = 'https://www.numbeo.com/cost-of-living/in/'
        this.table_selector = 'table.new_bar_table > tr'
    }

    detailsHref(city) {
        let detailsUrl = new URL(this.detailRedirect)
        detailsUrl.searchParams.set('city_id', city.numbeo_id)
        detailsUrl.searchParams.set('where', this.detailPrefix)
        return detailsUrl.href
    }

    async scrapeDetails(city) {
        let url = this.detailsHref(city)
        let scraper = await new Scraper().fetch(url)
        let results = await scraper.querySelector(this.table_selector).getText()
        return this.categorizeDetails(results)
    }


    categorizeDetails(scraperResults) {
        let currentKey = ""
        let categorized = []
        for (let row of scraperResults[this.table_selector]) {
            switch (row.length) {
                case 1:
                    currentKey = row[0]
                    break;
                case 2:
                    if (row[1] !== "?") {
                        categorized.push({
                            category: currentKey,
                            item: row[0],
                            average: row[1]
                        })
                    }
                    break;
                case 4:
                    categorized.push({
                        category: currentKey,
                        item: row[0],
                        average: row[1],
                        low: row[2],
                        high: row[3]
                    })
                    break;
                default:
                    console.log("No match on row", row);
                    break;

            }
        }
        return categorized
    }

}