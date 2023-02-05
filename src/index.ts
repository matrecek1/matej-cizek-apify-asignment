import axios from "axios";
interface ResponseData {
    total: number;
    count: number;
    products: {}[];
}


class Scraper {
    products: {}[];
    minQuery: number;
    maxQuery: number;
    maximumPrice: number;
    constructor(minPrice: number, maxPrice: number) {
        this.maximumPrice = maxPrice;
        this.products = [];
        this.minQuery = minPrice;
        this.maxQuery = maxPrice;
    }
    async getProducts() {
        while (this.minQuery !== this.maxQuery) {
            const response = await this.getResponse(this.minQuery, this.maxQuery)
            //If get response resulted in error, i determine if i want to try again or no.
            if (response.error) {
                switch(response.error.status){
                    
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
            if (res.total > 1000) {
                this.getNewMax()
                continue
            }

            //If total is <= 1000, i know that i can extract the products, getNewMin
            if (res.total <= 1000) {
                this.products.push(res.products)
                this.getNewMin
                continue
            }

        }
    }
    //This method takes the existing minQuery and maxQuery price range and sets it to half.
    getNewMax() {
        let newMax = Math.floor((this.maxQuery - this.minQuery) / 2)
        this.maxQuery = newMax
    }

    //I call this method if i know that the minQuery and maxQuery price range
    //doesnt contain any products,so i set the minQuery from where the maxQuery was
    //and start with the maxQuery at maximumPrice. 
    getNewMin() {
        this.minQuery = this.maxQuery
        this.maxQuery = this.maximumPrice
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


