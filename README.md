## Notes

**Asignment question**: Is there some expectations your code relies on? If yes, write it in the comments. Could the code be written in a way that does not depend on these expectations?

Answer: My code relies on the expectation that there arent more than 1000 products on one price point(ex. 1050 products priced at 50$). (we expect the minimal granularity of the search to be $1).

If this would be the case I could never scrape more than 1000 products. In case that the API returns randomly sorted products, the mitigation would be getting this price point multiple times and compare with already scraped ones, adding newly found and break this loop once the amount is reached.


## ToDo

Tests. 

Real HTTP requests - better error handling and retries.