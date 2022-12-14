class CityDetails {
    constructor(city) {
        const search = new URL('https://www.numbeo.com/common/CitySearchJson')
        search.searchParams.append('term', `${city.city}, ${city.state}`)

        const details = new URL("https://www.numbeo.com/cost-of-living/in/");
    }

}