import axios from "axios";
interface ResponseData {
    total: number;
    count: number;
    products: {}[];
}


class Scraper {
    maximumProductsPerRequest: 1000;
    products: {}[];
    minQuery: number;
    maxQuery: number;
    maximumPossiblePrice: number;
    constructor(minPrice: number, maxPrice: number) {
        this.maximumPossiblePrice = maxPrice;
        this.products = [];
        this.minQuery = minPrice;
        this.maxQuery = maxPrice;
        this.maximumProductsPerRequest = 1000
    }
    async getProducts() {
        while (this.minQuery !== this.maxQuery) {
            //reach out to the api using a method that calls axios get request
            const response = await this.getResponse(this.minQuery, this.maxQuery)
            //If get response resulted in error, i determine if i want to try again or no.
            if (response.error) {
                let {error} = response
                if(error.status > 500){
                    //if the error status code is 5**, its a server error so i try again
                    let message = `Request failed with status code:${error.status}, message:${error.message}, TRYING AGAIN.`
                    console.log(message);
                    continue
                } else{
                    // if error isnt 500 its a user error so i dont retry and abort.
                    let message = `Request failed with status code:${error.status}, message:${error.message}, ABORTING SCRAPE.`
                    console.log(message)
                    return
                }
            }

            //Here i know ive got my data from the response and can start scraping.
            const res = response as ResponseData

            // I will check if total is 0, which could happen if, i decreased
            // the price range too much so there werent any products.
            // Now i know that i can run the getNewMin method (explained below) and start loop again.
            if (res.total === 0) {
                this.getNewMin()
                continue
            }

            //Here if total is > 1000, i know that i need to make the price range smaller
            // so i run the getNewMax method (explained below) and restart the loop.
            if (res.total > this.maximumProductsPerRequest) {
                this.getNewMax()
                continue
            }

            //If total is <= 1000, i know that i can extract the products, getNewMin
            if (res.total <= this.maximumProductsPerRequest) {
                this.products.push(res.products)
                this.getNewMin()
                continue
            }

        }
        console.log("Scraping done.")
    }
    //This method takes the existing minQuery and maxQuery price range and sets it to half.
    getNewMax() {
        //calculate new price range by spliting the current price range
        let newPriceRange = Math.floor((this.maxQuery - this.minQuery) / 2)
        //get the value for new max price query, and se it
        let newMax = this.minQuery + newPriceRange 
        this.maxQuery = newMax
    }

    //I call this method if i know that the minQuery and maxQuery price range
    //doesnt contain any products,so i set the minQuery from where the maxQuery was
    //and start with the maxQuery at maximumPrice. 
    getNewMin() {
        this.minQuery = this.maxQuery
        this.maxQuery = this.maximumPossiblePrice
    }
    // A method that makes Axios call to the api, it either returns data or an error.
    async getResponse(minQuery: number, maxQuery: number) {
        try {
            const { data } = await axios.get('https://api.ecommerce.com/products', {
                params: {
                    minPrice: minQuery,
                    maxPrice: maxQuery
                }
            })
            return data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const response = {
                    error: {
                        status: error.status,
                        message: error.message,
                    }
                }
                return response
            }
        }
    }
}

//const scraper = new Scraper(0, 100000)


