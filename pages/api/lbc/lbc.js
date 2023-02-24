const { ApifyClient } = require('apify-client');

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_aTw3w9xskqFhnfFhwvls8k8CpBsgUh12MlI9',
});

// Prepare actor input
const input = {
    "startUrls": [
        {
            "url": "https://www.leboncoin.fr/recherche?category=21&text=mer&price=17-50"
        }
    ],
    "pageFunction": async function pageFunction(context) {
        let data = {}
        let userData = context.request.userData
        data.url = context.request.url
        data.label = userData.label
    
        let items = await context.page.evaluate(() => {
            const item = $('[data-qa-id=aditem_container]')
            const itemInfo = item.map(function(i,elem) {
                let obj = {}
                obj.title = $(this).find('[data-qa-id=aditem_title]').text()
                obj.price = $(this).find('[data-test-id=price]').text()
                obj.location = $(this).find('span').filter(function() { return this.title.match(/[0-9]{5}/);}).text()
                obj.date = $(this).find('span').filter(function() { return this.title.match(/:/);}).text()
                obj.img = $(this).find('[data-test-id=adcard-consumer-goods-list] img').attr('src')
                obj.rank = i+1
                return obj
            }).get()
            return itemInfo
        })
        let itemsWithDataProp = items.map(obj => { 
            for(const key of Object.keys(data) ){
                obj[key] = data[key]
            }
            return obj
        })
        return itemsWithDataProp;
    },
    "proxyConfiguration": {
        "useApifyProxy": true,
        "apifyProxyGroups": [
            "RESIDENTIAL"
        ],
        "apifyProxyCountry": "FR"
    }
};

(async () => {
    // Run the actor and wait for it to finish
    const run = await client.actor("anchor/leboncoin").call(input);

    // Fetch and print actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    items.forEach((item) => {
        console.dir(item);
    });
})();
