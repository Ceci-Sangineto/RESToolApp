class pageObjects {
    get_card(id_character) {
        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/character' + id_character,
            form: true,
        }).then(async (response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
            cy.log("Desde el POM" + response.body)
            return response.body
        });
    }
}

export default pageObjects; 