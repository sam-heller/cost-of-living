class CityList {
    constructor() {
        this.url = new URL("https://www.numbeo.com/cost-of-living/country_result.jsp");
        this.url.searchParams.append("country", "United States");
        this.startString = '<option value="">--- Select city---</option>'
        this.endString = '</select>'
    }

    async build() {
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
}

module.exports = { CityList };