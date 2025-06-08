import { utils } from '../support/e2e'

describe('Comment', () => {
    it('create comment', () => {
        cy.intercept('GET', utils.apiUrl + 'posts*').as('postRequest')
        cy.intercept('POST', utils.apiUrl + 'user/comment').as('commentRequest')

        cy.login(utils.email, utils.password)
        cy.get('#readPost', { timeout: 5000 }).first().click()
        cy.wait('@postRequest')
        cy.url().should('match', /\/posts\/\d+$/)
        cy.get('#comment').type('Hello world!')
        cy.get('#addComment', { timeout: 5000 }).click()
        cy.wait('@commentRequest')
        cy.logout()
    })

    it('delete comment', () => {
        cy.intercept('GET', utils.apiUrl + 'posts*').as('postRequest')
        cy.intercept('DELETE', utils.apiUrl + 'user/comment/*').as('commentRequest')

        cy.login(utils.email, utils.password)
        cy.get('#readPost').first().click()
        cy.wait('@postRequest')
        cy.url().should('match', /\/posts\/\d+$/)
        cy.get('#deleteComment', { timeout: 5000 }).first().click()
        cy.wait('@commentRequest')
        cy.logout()
    })
})