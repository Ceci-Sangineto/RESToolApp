describe("Testing get characters", () => {

    it("Test POST AND DELETE employees", () =>{
        cy.wait(2000)
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            form:true,
            body:{
                id: "IDCecilia",
                name: "Ceci",
                jobTitle: "Tester intern",
                isFired: false
            }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)            
            cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=300")
            cy.wait(5000)                                                 
            cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => {
                cy.log($el.text())               
                if ($el.text() == response.body.id) {
                    cy.log('Element found')
                    return
                }     
            })

            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/employee/'+response.body.id            
            }).then(async(response) => { 
                expect(response.status).to.eq(200)
                cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => {              
                    if ($el.text() == response.body.id) {
                        cy.log('item not removed successfully')
                        return
                    }
                })
                cy.log("Item removed successfully")
                cy.reload()  
            })
        })
    }); 
})