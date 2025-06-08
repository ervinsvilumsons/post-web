// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
})

export const utils = {
    port: '8080',
    get url() {
        return `http://localhost:${this.port}/`
    },
    get apiUrl() {
        return 'http://localhost:9001/api/'
    },
    email: 'e2e@test.com',
    password: 'password',
    randomEmail: () => `user_${Math.random().toString(36).substring(2, 8)}@example.com`,
}

Cypress.Commands.add('login', (email, password) => {
    cy.visit(utils.url + 'login')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('register', (name, email, password, password_confirmation) => {
    cy.visit(utils.url + 'register')
    cy.get('#name').type(name)
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#passwordConfirmation').type(password_confirmation)
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('logout', (name, email, password, password_confirmation) => {
    cy.get('#logout').click()
})