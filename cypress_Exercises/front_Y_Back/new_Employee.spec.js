describe("Test Employees", () => {
    const uniqueSeed = Date.now().toString()

    it("Test POST", () => {
        cy.wait(2000)
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            body:{
                id: uniqueSeed,
                name: "Cecilia Sangineto",
                jobTitle: "Tester Junior",
                isFired: false
            }           
        }). then(async(response) => { 
            await expect(response.status).to.eq(200)

            cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=300")
            cy.wait(5000)                                                 
            cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => {
                const Array = []

                cy.log($el.text())               
                if ($el.text() == response.body.id) {
                    Array.push($el.text());
                    cy.log('Element found') }     
            })
               expect(Array).to.have.length(1)
        })
    })

    it("Test DELETE", () => {
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/employee/'+uniqueSeed,    
            }).then(async(response) => { 
            expect(response.status).to.eq(200)
            cy.reload()

            cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=300")
            cy.wait(5000)   
            const idArray = []
                                                          
            cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => {
                cy.log($el.text())               
                if ($el.text() == response.body.id) {
                   idArray.push($el.text());
                   cy.log('Element NOT removed') }   
            })
            expect(idArray).to.have.length(0)
        })
    })
})