// <reference types="Cypress" />

describe("Search iPhone 13 on Amazon and eBay", () => {
  it("Search iPhone 13 on Amazon and eBay", () => {
    cy.visit('https://www.amazon.com/?language=en_US&currency=HKD');

    // Type "iPhone 13" in the search bar
    cy.get('#twotabsearchtextbox')
      .type('iPhone 13')
    
    cy.get('#nav-search-submit-button').click();

    // Wait for the search results to load
    cy.get('#search').should('be.visible')

    cy.get('.icp-nav-flag').click();

    cy.get('[data-action="a-dropdown-button"]').click();
    
    cy.get('#HKD').click();

    cy.get('.a-button-input').click();

    cy.scrollTo('bottom', { duration: 5000 });

    cy.writeFile('cypress/fixtures/amazon.json', '[\n', { flag: 'w' })
    // Extract the product details
    cy.get('.s-search-results')
      .find('.sg-col-inner')
      .then(($products) => {
        const productArray = [];

        $products.each((index, $product) => {
          const $name = $product.querySelector('.a-size-medium');
          const $price = $product.querySelector('.a-price-whole');
          const $url = $product.querySelector('.a-link-normal');

          const name = $name ? $name.textContent : '';
          const price = $price ? $price.textContent.replace('.', '') : '';
          const url = $url ? 'https://www.amazon.com' + $url.getAttribute('href') : '';

        const product = { website: 'Amazon', name, price, url };
        productArray.push(product);
      })

      const jsonData = JSON.stringify(productArray, null, 2);
      cy.writeFile('cypress/fixtures/amazon.json', jsonData);

       })
      
    cy.visit("https://www.ebay.com/");
    cy.get("#gh-ac").type("iPhone 13");
    cy.get("#gh-btn").click();

    cy.scrollTo('bottom', { duration: 5000 });

    try {
      cy.get('.s-item__info').then(($products) => {
          const productArray = [];

          $products.each((index, $product) => {
            const $name = $product.querySelector('.s-item__title');
            const $price = $product.querySelector('.s-item__price');
            const $url = $product.querySelector('.s-item__link');

            const name = $name ? $name.textContent.trim()  : '';
            const price = $price ? $price.textContent.trim() : '';
            const url = $url ? $url.getAttribute('href') : '';

            const product = { website: 'ebay', name, price, url };
            productArray.push(product);
          })

          // Save the product details in ebay.json
          const jsonData = JSON.stringify(productArray, null, 2);
          cy.writeFile('cypress/fixtures/ebay.json', jsonData);
          });
      } catch (error) {
        // Handle the exception
        cy.log(`An exception occurred: ${error.message}`);
      } 
      try {
        cy.readFile('cypress/fixtures/amazon.json').then((amazonData) => {
          // Read the contents of ebay.json
          cy.readFile('cypress/fixtures/ebay.json').then((ebayData) => {
            // Combine the data from both files
            const combinedData = [...amazonData, ...ebayData]
    
             // Filter out records with empty prices
            const filteredData = combinedData.filter(record => record.price.trim() !== '');

            // Sort the data by price in ascending order
            filteredData.sort((a, b) => {
              const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ''));
              const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
              return priceA - priceB;
            });

            console.log(filteredData);

            // Save the combined, filtered, and sorted data in finalresult.json
            cy.writeFile('cypress/fixtures/finalresult.json', filteredData);
          })
        })
      } catch (error) {
        // Handle the exception
        cy.log(`An exception occurred: ${error.message}`);
      }
    
  });
});