describe("Test Employees", () => {
    const uniqueSeed = Date.now().toString()

    it("Test POST", () => {
        let name = "Cecilia"
        let jobTitle = "Tester Junior"
        let isFired = false

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            body:{
                id: uniqueSeed,
                name: name,
                jobTitle: jobTitle,
                isFired: isFired
            }           
        }). then(async(response) => { 
            await expect(response.status).to.eq(200)

            cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=300")
            cy.wait(5000)                                                 
            cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').then(($array) => {
                const ids = Cypress._.map($array, 'innerText')
                expect(ids).includes(uniqueSeed)
            })
        })
    })

    it("Test DELETE", () => {
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/employee/'+uniqueSeed,    
            }).then(async(response) => { 
            expect(response.status).to.eq(200)

            // vemos si se elimino del back
            cy.get_back_ids('https://restool-sample-app.herokuapp.com/api/employee').then(($array) => {
                const ids = Cypress._.chain($array).map('id').value()
                expect(ids).not.includes(uniqueSeed)
            })

            cy.reload()
            cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=300")
            cy.wait(5000)
            
            // vemos si se elimino del front
            cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').then(($array) => {
                    const ids = Cypress._.map($array, 'innerText')
                    expect(ids).not.includes(uniqueSeed)
                })
        })
    })
})