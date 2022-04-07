describe("Testing get characters", () => {
    let control_var = true;

    it("Test GET Extras", () => { 
        var array = 
                cy.request({
                    method: 'GET',
                    url: 'https://restool-sample-app.herokuapp.com/api/extra',
                    form:true           
                }).then((response) => { 
                    expect(response.status).to.eq(200)
                    expect(response.body.items.name).to.not.be.null
                    //cy.log(JSON.stringfy(response.body.items))
                    return response.body.items.id         
                });

        cy.visit("https://dsternlicht.github.io/RESTool/#/extras")

        let idArray = []
        cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length.greaterThan',0)
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            
            cy.wrap($el).then((val) => {
                for( let i=0; i < array.lenght; i++){
                    if ($lis.not.includes(array[i])){
                        idArray.push(array[i])
                        control_var = false
                    }
                }
            })

        }). then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)
            expect(control_var).to.be.eq(true)       
        })
    })   
})