import pageObjects from '../pageObjects/pageObjects';

describe("Test Characters", function () {

    const uniqueSeed = Date.now().toString()
    let control_var = true
    let post_response
    let put_response
    let delete_response
    let pageObject = new pageObjects();

    it.skip("Test GET", () => {
        cy.get_back_ids('https://restool-sample-app.herokuapp.com/api/character').then((array_back) => {
            const ids_back = Cypress._.chain(array_back).map('id').value()

            cy.viewport(1440, 860);
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

            cy.get('main > div > div > div > div:nth-child(2) > span').then(($array_front) => {
                const ids_front = Cypress._.map($array_front, 'innerText')

                cy.get('#root > div > div.app-page > main > p').then(($elem) => {
                    const myArray = $elem.text().split(" ")
                   expect(ids_front.length).eq(myArray[1]) // Comparo que el numero de ids que dice la pagina sea igual al del front
                })

                cy.contains_the_same_elems(ids_back, ids_front).then((comparation) => {
                    expect(comparation).to.eq(true)
                })
            })
        })
    })

    it("Test POST", () => {

        let isAlive = false
        let location = "Beyond the wall"
        let name = "Sangineto Cecilia"
        let real_name = "Cecilia"
        let thumbnail = "Test"

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form: true,
            body: {
                id: uniqueSeed,
                isAlive: isAlive,
                location: location,
                name: name,
                realName: real_name,
                thumbnail: thumbnail
            }
        }).then(async (response) => {
            post_response = response
            await expect(response.status).to.eq(200)
            expect(response.body.realName).to.be.eq("Cecilia")

            cy.viewport(1440, 860);
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

            cy.scrollTo('bottom')
            cy.wait(2000)
            cy.scrollTo('bottom')
            cy.wait(2000)
            cy.scrollTo('bottom')
            cy.wait(4000)
            cy.scrollTo('bottom')

            cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(2) > span').should('have.length.greaterThan', 0)
            cy.get('#root > div > div.app-page > main > div > div > div> div:nth-child(2) > span').then(($array) => {

                const ids = Cypress._.map($array, 'innerText')

                cy.get('#root > div > div.app-page > main > p').then(($elem) => {
                    const myArray = $elem.text().split(" ")
                    expect(ids.length).eq(myArray[1]) // Falla porque en el front no cargan todas las cards
                })

                expect(ids).includes(uniqueSeed) // si falla el anterior este no se deberia correr
            })
        })
    })

    it("Test PUT", () => {

        let new_name = "Cecilia Sangineto Ruibal"
        let new_real_name = "Maria Cecilia Sangineto Ruibal"
        let new_isAlive = true
        let new_location = "Buenos Aires"

        cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/character/' + uniqueSeed,
            body: {
                name: new_name,
                realName: new_real_name,
                isAlive: new_isAlive,
                location: new_location,
            }
        }).then(async (response) => {
            await expect(response.status).to.eq(200)

            // pageObject.get_card(uniqueSeed)

            cy.get_card(uniqueSeed).then((character) => {
                expect(character.name).to.deep.equal(new_name)
                expect(character.realName).to.deep.equal(new_real_name)
                expect(character.isAlive).to.deep.equal(new_isAlive)
                expect(character.location).to.deep.equal(new_location)
                cy.log(character)
            })
        })
    })

    it("Test DELETE", () => {
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/character/' + uniqueSeed,
        }).then(async (response) => {
            await expect(response.status).to.eq(200)
        })

        //checkeamos el back

        cy.reload()
        cy.scrollTo('bottom')

        cy.get_back_ids('https://restool-sample-app.herokuapp.com/api/character').then((array) => {
            // cy.log(JSON.stringify(array))
            const ids = Cypress._.chain(array).map('id').value()
            // cy.log(ids)
            // var numeros = [1 ,2 ,3]
            // cy.log("El numero 2 esta contenido en el array? :" + numeros.includes(4));
            expect(ids).not.includes(uniqueSeed)

        })

        //checkeamos el front

        cy.viewport(1440, 860);
        cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

        cy.scrollTo('bottom')
        cy.wait(2000)
        cy.scrollTo('bottom')
        cy.wait(2000)
        cy.scrollTo('bottom')
        cy.wait(4000)
        cy.scrollTo('bottom')

        cy.get('main > div > div > div > div:nth-child(2) > span').then(($array) => {
            const ids = Cypress._.map($array, 'innerText')

            cy.get('#root > div > div.app-page > main > p').then(($elem) => {
                const myArray = $elem.text().split(" ")
                expect(ids.length).eq(myArray[1]) // Falla porque en el front no cargan todas las cards
            })

            expect(ids).not.includes(uniqueSeed) // si falla el anterior este no se deberia correr
        })
    })
})