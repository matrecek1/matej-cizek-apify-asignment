import axios from "axios";
interface ProductData {
    total: number;
    count: number;
    products: {}[];
}

interface ScrapeReport {
    completed: boolean;
    products?: {}[];
    error?: Error;
    stateOnError?: {
        minQuery: number;
        maxQuery: number;
    }
}


export class Scraper {
    maximumProductsPerRequest: 1000;
    products: {}[];
    minQuery: number;
    maxQuery: number;
    maximumPossiblePrice: number;
    url: string;
    completed: boolean;
    constructor(minPrice: number, maxPrice: number, url: string) {
        this.completed = false
        this.url = url
        this.maximumPossiblePrice = maxPrice;
        this.products = [];
        this.minQuery = minPrice;
        this.maxQuery = maxPrice;
        this.maximumProductsPerRequest = 1000
    }
    // this does the scraping
    async scrapeProducts(): Promise<ScrapeReport> {
        while (true) {
            // If min Query equals maximum price we know that all items have been scraped
            if (this.minQuery == this.maximumPossiblePrice) {
                console.log("Scrape completed!");
                return {
                    products: this.products,
                    completed: true,
                };
            }
            //reach out to the api using a method that calls axios get request
            const response = await this.getResponse(this.minQuery, this.maxQuery, this.url)
            //Here i handle the possible errors if they are retryable i restart the loop, else i end the scrape
            if (response?.error) {
                //TODO: i should set the max number of retries, which if is reached the scrape is ended
                if (response.error.retryable) {
                    const message = `Request failed with status:${response.error.status}, message:${response.error.message}, TRYING AGAIN`
                    console.log(message);
                    continue
                } else {
                    //Here if error isnt retriable i end the scrape
                    const message = `Request failed with status:${response.error.status}, message:${response.error.message}, ABORTING`
                    console.log(message);
                    return {
                        completed: false,
                        error: new Error(message),
                        stateOnError: {
                            minQuery: this.minQuery,
                            maxQuery: this.maxQuery
                        }

                    }
                }
            }
            // if data is null I end the scrape 
            if (!response?.data) {
                const message = 'Abandoning scrape didnt get any data'
                return {
                    completed: false,
                    error: new Error(message),
                    stateOnError: {
                        minQuery: this.minQuery,
                        maxQuery: this.maxQuery
                    }
                }
            }
            //Here i know i got my data so i can start scraping
            const data = response.data as ResponseData
            // If the total is 0 i know that there arent any products at this price range and can move on.
            if (data.total === 0) {
                this.getNewMin()
                continue
            }

            // Here if total is > 1000, i know that i need to make the price range smaller
            // so i run the getNewMax method (explained below) and restart the loop.
            if (data.total > this.maximumProductsPerRequest) {
                this.splitCurrentRange()
                continue
            }

            //If total is <= 1000, i know that i can extract the products, getNewMin
            if (data.total <= this.maximumProductsPerRequest) {
                this.products.push(data.products)
                this.getNewMin()
                continue
            }

        }
    }
    //This method takes the existing minQuery and maxQuery price range and sets it to half.
    splitCurrentRange() {
        //calculate new price range by spliting the current price range
        this.maxQuery = this.minQuery + Math.floor((this.maxQuery - this.minQuery) / 2)
    }

    //I call this method if i know that the minQuery and maxQuery price range
    //doesnt contain any products,so i set the minQuery from where the maxQuery was
    //and start with the maxQuery at maximumPrice. 
    getNewMin() {
        this.minQuery = this.maxQuery
        this.maxQuery = this.maximumPossiblePrice
    }
    // A method that makes Axios call to the api, it either returns data or an error.
    async getResponse(minQuery: number, maxQuery: number, url: string) {
        // I set the timeout for the request to 30 seconds, I should probably make this as configurable option.
        const timeout = 1000 * 30
        try {
            const { data } = await axios.get(url, {
                params: {
                    minPrice: minQuery,
                    maxPrice: maxQuery
                },
                timeout
            })
            return { data }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // If the error is 500 its server again so I try again
                if (error.response?.status && error.response.status >= 500) {
                    return {
                        error: {
                            retryable: true,
                            status: error.status,
                            message: error.message
                        }
                    }
                } else {
                    // for other errors I dont want to retry 
                    return {
                        error: {
                            retryable: false,
                            status: error.status,
                            message: error.message
                        }
                    }
                }
            }
        }
    }
}



