export default class CityList {
    constructor(env) {
        this.env = env
        this.url = new URL("https://www.numbeo.com/cost-of-living/country_result.jsp")
        this.startString = '<option value="">--- Select city---</option>'
        this.endString = '</select>'
    }

    async build() {
        this.url.searchParams.append("country", "United States");
        const response = await fetch(this.url.href)
        const rd = await response.text()
        let startPos = rd.indexOf(this.startString) + this.startString.length
        let endPos = rd.indexOf(this.endString)
        let cities = rd.substring(startPos, endPos)
            .replaceAll(/<.*?>/g, '')
            .split("\n")
            .filter((e) => e.length > 0)
            .map((e) => e.trim().split(", "))
            .map((e) => ({ city: e[0], state: e[1], id: 0, data: {} }))
        return cities
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