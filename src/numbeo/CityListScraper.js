import Scraper from '../lib/Scraper';
export default class NumbeoCityListScraper {
    constructor(env) {
        this.env = env
        this.url = new URL("https://www.numbeo.com/cost-of-living/country_result.jsp")
        this.selector = '#city > option'
    }

    async build() {
        this.url.searchParams.append("country", "United States");
        let list_scraper = await new Scraper().fetch(this.url.href)
        let results = await list_scraper.querySelector(selector).getText()
        return results[selector]
            .map((e) => e.shift())
            .filter((e) => !e.startsWith('---'))
            .map((e) => e.split(', '))
            .map((e) => ({ city: e[0], state: e[1] }))
    }

    async populateDB() {
        let queries = []
        try {
            const data = await this.build()
            for (let city of data) {
                queries.push(`INSERT INTO City (\`name\`, \`region\`) VALUES("${city.city}", "${city.state}");`)
            }
            return queries.join("\n")
        } catch (e) {
            console.log("Error populating DB: ", e)
            return e
        }
    }

}