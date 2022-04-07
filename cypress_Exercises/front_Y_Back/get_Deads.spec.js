describe("Test DEADS", () => {

    it("Test GET", () => { 
        var array = 
                cy.request({
                    method: 'GET',
                    url: 'https://restool-sample-app.herokuapp.com/api/dead?search=',
                    form:true           
                }).then((response) => { 
                    expect(response.status).to.eq(200)
                    expect(response.body.items.name).to.not.be.null
                    return response.body.items.id
                });

        cy.visit("https://dsternlicht.github.io/RESTool/#/deads")
        let idArray = []
        cy.get("#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span").should('have.length.greaterThan',0)
        cy.get("#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span").each(($el, index, $lis) => {   
            
            cy.wrap($el).then((val) => {
                idArray.push(val.text());
                expect(array).include(val.text)                
            })

        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })   
})