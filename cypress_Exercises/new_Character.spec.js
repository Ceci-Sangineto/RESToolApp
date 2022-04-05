describe("Testing get characters", () => {
    it("Test POST & PUT & DELETE character", () => { 
        const uniqueSeed = Date.now().toString();
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form:true,
            body:{
                "isAlive":false,
                "location":"Beyond the Wall",
                "name":uniqueSeed,
                "realName":"Cecilia",
                "thumbnail":"test"
            }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)            
            cy.viewport(1920,1080);
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")
            cy.scrollTo('bottom') 
            cy.log("name created :"+response.body.realName)
            cy.get('div>div:nth-child(3)>span').should('have.length.greaterThan',0)                                                    
            cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => { 
                cy.log($el.text())               
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)          
            })
            
            cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/character/'+response.body.id,
            form:true,
            body:{
                "name": "Ceciliaaa",
                "realName": "Ceciliaaa",
                "isAlive" : true,
                "location": "Buenos Aires",
            }           
            }).then(async(response) => { 
            await expect(response.status).to.eq(200)            
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")                                                 
            cy.get('#root > div > div.app-page > main > div > div > div > div:nth-child(2) > span').each(($el, index, $lis) => {
                cy.log($el.text())               
                if ($el.text() == "Ceciliaaa") {
                    cy.log('Element found')
                    return
                }     
              }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
              })
            });       
    
            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/character/'+response.body.id            
            }).then((response) => { 
                expect(response.status).to.eq(200)
                cy.reload()
                cy.get('#root > div > div.app-page > main > div > div > div > div:nth-child(2) > span').each(($el, index, $lis) => {              
                    if ($el.text() == response.body.id) {
                        cy.log('item not removed successfully')
                        return
                    }
                })
                cy.log("Item removed successfully")
            })      
        });       
    })
})