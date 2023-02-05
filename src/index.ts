import { Scraper } from "./scraper";
const URL = "https://api.ecommerce.com/products"

const scraper = new Scraper(1, 100000, URL)

scraper.scrapeProducts().then((report) => {
    console.log('SCRAPER finished');
    console.log('  finished ok: ', report.completed);
    if (report.error) {
        console.log('  error: ', report.error);
        console.log('  lastState: ');
        console.log('    minQuery: ', report.stateOnError?.minQuery);
        console.log('    maxQuery: ', report.stateOnError?.maxQuery);
    }
    console.log('scraped products: ', report.products?.length);
}).catch((error) => {
    console.log('This error should not happen: ', error);
})