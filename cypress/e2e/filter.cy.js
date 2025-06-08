import { utils } from '../support/e2e'

describe('Filter', () => {
    it('filter category', () => {
        cy.intercept('GET', utils.apiUrl + 'categories').as('categoriesRequest')
        cy.intercept('GET', utils.apiUrl + 'posts*').as('postRequest')

        cy.login(utils.email, utils.password)
        cy.wait('@categoriesRequest')
        cy.wait('@postRequest')
        cy.get('#categoryFilter').select('Art')
        cy.wait('@postRequest')
        cy.contains('Art').should('be.visible')
        cy.logout()
    })

    it('filter search', () => {
        cy.intercept('GET', utils.apiUrl + 'categories').as('categoriesRequest')
        cy.intercept('GET', utils.apiUrl + 'posts*').as('postRequest')

        cy.login(utils.email, utils.password)
        cy.wait('@categoriesRequest')
        cy.wait('@postRequest')
        cy.get('#searchFilter').type('lorem')
        cy.get('#search').click()
        cy.wait('@postRequest')
        cy.contains('lorem').should('be.visible')
        cy.logout()
    })
})
