export default class NumbeoCitySearch {
    constructor() {
        this.url = 'https://www.numbeo.com/common/CitySearchJson'
    }

    async find(city) {
        let search = new URL(this.url)
        search.searchParams.set('term', `${city.name}, ${city.region}`)
        let data = await fetch(search.href)
            .then((e) => e.json())
            .then((e) => e.shift())
            .then((e) => e.value)
        return data
    }
}