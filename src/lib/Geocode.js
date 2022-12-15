export default class Geocode {
    constructor(api_key){
        this.options = {
            method: 'GET',
            headers: {'X-api-key': api_key}
          };
        this.url = "https://api.api-ninjas.com/v1/geocoding"
    }

    async getLatLon(city){
        let searchUrl = new URL(this.url)
        searchUrl.searchParams.set('city', city.name)
        searchUrl.searchParams.set('state', city.region)
        searchUrl.searchParams.set('country', 'US')
        const response = await fetch(searchUrl.href, this.options)
        return await response.json()
    }
    
}