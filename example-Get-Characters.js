describe("Testing get characters", () => {

    beforeEach("Obteniendo el id de los empleados", () => {
        let idArray = []
        cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=300")
            cy.wait(5000)                                                
            cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => {              
                cy.wrap($el).then((val) => {
                    idArray.push(val.text());
                    cy.log(idArray[index])               
                })
            })
    })

    it("Test GET characters - extras", () => { 
        var array = 
                cy.request({
                    method: 'GET',
                    url: 'https://restool-sample-app.herokuapp.com/api/extra',
                    form:true           
                }).then((response) => { 
                    expect(response.status).to.eq(200)
                    expect(response.body.items.name).to.not.be.null  
                    return response.body.items.id          
                });

        cy.visit("https://dsternlicht.github.io/RESTool/#/extras")
        let idArray = []
        cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length.greaterThan',0)
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            
            cy.wrap($el).then((val) => {
                idArray.push(val.text());
                expect(array).include(val.text)                
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })   

    it("Test get characters - deads", () => { 
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

    it("Test POST new character", () => { 
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
            cy.wait(5000)    
            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/character/'+response.body.id            
            }).then((response) => { 
                expect(response.status).to.eq(200)        
                })   
                        
        });       
    })

    it("Test PUT new character", () => {
        const newName = "Ceciliaaa"
        cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/character/K6nfafIiGbVM',
            form:true,
            body:{
                "name": newName,
                "isAlive" : true,
                "location": "Buenos Aires",
            }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)            
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")
            cy.wait(5000)                                                 
            cy.get('#root > div > div.app-page > main > div > div > div > div:nth-child(3) > span').each(($el, index, $lis) => {
                cy.log($el.text())               
                if ($el.text() == newName) {
                    cy.log('Element found')
                    return
                }     
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            })
        });       
    })

    it("Test POST employees", () =>{
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
                cy.reload()
                cy.get('#root > div > div.app-page > main > div > table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => {              
                    if ($el.text() == response.body.id) {
                        cy.log('item not removed successfully')
                        return
                    }
                })
                cy.log("Item removed successfully")
                
            })

        })

        
    }); 
    
    it.only("Test POST employees with arrays", () =>{
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
        })
    });
})