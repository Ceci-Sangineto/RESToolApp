describe("Test Characters", () => {

    const uniqueSeed = Date.now().toString()

    it("Test GET", () => { 
        var array = 
                cy.request({
                    method: 'GET',
                    url: 'https://restool-sample-app.herokuapp.com/api/character',
                    form:true           
                }).then((response) => { 
                    expect(response.status).to.eq(200)
                    expect(response.body.items.name).to.not.be.null
                    return response.body.items.id
                });

        cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")
        cy.get("#root > div > div.app-page > main > div > div > div > div:nth-child(2) > span").should('have.length.greaterThan',0)
        cy.get("#root > div > div.app-page > main > div > div > div > div:nth-child(2) > span").each(($el, index, $lis) => {   
            let idArray = []
            cy.wrap($el).then((val) => {
                idArray.push(val.text());
                expect(array).include(val.text)                
            })

        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })

    it("Test POST", () => { 
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form:true,
            body:{
                "id":uniqueSeed,
                "isAlive":false,
                "location":"Beyond the Wall",
                "name":"Sangineto Cecilia",
                "realName":"Cecilia",
                "thumbnail":"test"
            }           
        }).then(async(response) => {
            await expect(response.status).to.eq(200)            
            cy.viewport(1920,1080);
            cy.log("name created :"+response.body.name) // Loguea el numero de ID creado

            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")
            cy.reload()
            cy.scrollTo('bottom')
            cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(2) > span').should('have.length.greaterThan',0) // Preguntar Pancho                                                   
            cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(2) > span').each(($el, index, $lis) => { 
                cy.log($el.text())               
                if ($el.text() == response.body.id) {
                    cy.log("Element found")
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)          
            })
        })
    })

    it ("Test PUT", () => {

        cy.request({
        method: 'PUT',
        url: 'https://restool-sample-app.herokuapp.com/api/character/'+uniqueSeed,
        body:{
                "name": "Cambiando El Nombre",
                "realName": "Ceciliaaa con tres a",
                "isAlive" : true,
                "location": "Buenos Aires",
        }           
        }).then(async(response) => { 
        await expect(response.status).to.eq(200)

        cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")                                                 
        cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(4) > span').each((elem, index, list) => {              
            if (elem.text() == response.body.realName) {
                cy.log('Element found')
                list.push(val.text());
            }
        }). then((list) => {
            expect(list).to.have.length(1)             
        })

      })

    })

    it("Test DELETE", () => {
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/character/'+uniqueSeed,       
        }).then(async(response) => {
            await expect(response.status).to.eq(200)
            cy.reload()
            cy.scrollTo('bottom')

            /*cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(2) > span').each((el, index, lis) => {          
                if (el.text() == uniqueSeed) {
                    cy.log($el.text)
                    lis.push($el.text());
                }                                 
            }).then((lis) => {
                expect(lis).to.have.length.lessThan(1)*/
        
        })
    })
})