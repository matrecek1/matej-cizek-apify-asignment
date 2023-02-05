Asignment question: Is there some expectations your code relies on? If yes, write it in the comments. 
                    Could the code be written in a way that does not depend on these expectations?
Answer: My code relies on the expectation that there arent more than 1000 products on one price point(ex. 1050 products priced at 50$).
        If this would be the case I could never scrape those products and the code will get stuck in a loop.
        It could teoretically be fixed if the returned products would be sorted randomly. 