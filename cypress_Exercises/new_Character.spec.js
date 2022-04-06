describe("Test Characters", () => {

    const uniqueSeed = Date.now().toString()
    let control_var = true
    let post_response
    let put_response
    let delete_response

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
            
            cy.wrap($el).then((val) => {
                for( let i=0; i < array.lenght; i++){
                    if ($lis.not.includes(array[i])){
                        idArray.push(array[i])
                        control_var = false
                    }
                }
            }). then(($lis) => {
                expect($lis).to.have.length.of.at.least(1)
                expect(control_var).to.be.eq(true)
            })
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
            post_response = response
            await expect(response.status).to.eq(200)            
            expect(response.body.realName).to.be.eq("Cecilia")

            cy.viewport(1440,860);
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

            cy.scrollTo('bottom')
            cy.wait(2000)
            cy.scrollTo('bottom')
            cy.wait(2000)
            cy.scrollTo('bottom')
            cy.wait(4000)
            cy.scrollTo('bottom')

            cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(2) > span').should('have.length.greaterThan',0) // Preguntar Pancho                                                   
            cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(2) > span').each(($el, index, $lis) => { 
                cy.log($el.text())
                if ($el.text() == response.body.id) {
                    cy.log("Element found")
                    return;
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)          
            })
        })
    })

    it ("Test PUT", () => {
        cy.request({
        method: 'PUT',
        url: 'https://restool-sample-app.herokuapp.com/api/character/' + uniqueSeed,
        body:{
                "name": "Cambiando El Nombre",
                "realName": "Ceciliaaa con tres a",
                "isAlive" : true,
                "location": "Buenos Aires",
        }           
        }).then(async(response) => {
        await expect(response.status).to.eq(200)
        })

        const idArray = []
        cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")                                                 
        cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(4) > span').each(($el, index, $lis) => {              
            cy.wrap($el).then((val) => {
                if (val.text() == response.body.realName){
                    idArray.push(val.text());
                }                
            })
        })
            expect(idArray).to.have.length(1)
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