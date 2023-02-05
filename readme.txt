ASIGNMENT QUESTION: Is there some expectations your code relies on? If yes, write it in the comments. 
                    Could the code be written in a way that does not depend on these expectations?
Answer: My code relies on the expectation that there arent more than 1000 products on one price point(ex. 1050 products priced at 50$).
        If this would be the case I could never scrape those products and the range would get so small that that the minPrice would equal to maxPrice
        and the while loop condition would trigger and send a log that the api was scraped, but it wouldnt be. If i would have more time i would rewrite
        the while loop that in the first cycle when minPrice is 0 and max is 100000 i would get the total number of all products in the api, store it and 
        then markj the scrape as complete when the scraped products length would equal to total number of products in the api.
NOTE: if would have more time I would make some Jest tests to test the algorhitm and the core logic. But I think its outside of this asignment description.