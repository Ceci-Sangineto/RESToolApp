// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('get_card', (id_character) => {
    cy.request({
        method: 'GET',
        url: 'https://restool-sample-app.herokuapp.com/api/character/' + id_character,
        form: true
    }).then(async (response) => {
        await expect(response.status).to.eq(200)
        expect(response.body).to.not.be.null
        cy.log(response.body)
        return response.body
    })
})

Cypress.Commands.add('get_back_ids', (url) => {
    cy.request({
        method: 'GET',
        url: url,
        form: true
    }).then(async (response) => {
        expect(response.status).to.eq(200)
        expect(response.body.items.name).to.not.be.null
        cy.log(response.body.items)
        return response.body.items
    })
})

Cypress.Commands.add('contains_the_same_elems', (array1, array2) => {
    if (array1.length === array2.length) {
        return array1.every(element => {
          if (array2.includes(element)) {
            return true;
          }
          return false;
        });
      }
      return false;
})
