class pageObjects {
    get_card(id_character) {
        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form: false,
            response: []
        }).then(async (response) => {
            expect(response.status).to.eq(200)
            expect(response.body.items.id).to.not.be.null
            cy.log(JSON.stringify(response.body.items))
            let items = []
            items = JSON.parse(JSON.stringify(response.body.items))

            for (let i = 0; i < items.lenght; i++) {
                if (items[i].id == id_character) {
                    cy.log("Hola, entre al if")
                    return items[i]
                }
            }
            return null
        });
    }
}

export default pageObjects; 