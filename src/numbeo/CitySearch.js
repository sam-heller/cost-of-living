export default class NumbeoCitySearch {
    constructor() {
        this.url = 'https://www.numbeo.com/common/CitySearchJson'
    }

    async find(city) {
        try {
            let search = new URL(this.url)
            search.searchParams.set('term', `${city.name}, ${city.region}`)
            let data = await fetch(search.href)
                .then((e) => e.json())
                .then((e) => e.shift())
                .then((e) => e.value)
            return data
        } catch (e){
            console.log("Error retrieving numbeo id for city", city.name, e)
            return -1
        }
    }
}