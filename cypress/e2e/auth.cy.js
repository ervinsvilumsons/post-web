import { utils } from '../support/e2e'

describe('Authentication', () => {
  it('login invalid credentials', () => {
    cy.login('user@example.com', 'password')
    cy.contains('Invalid credentials').should('be.visible')
  })

  it('login valid credentials', () => {
    cy.login(utils.email, utils.password)
    cy.url().should('include', utils.url)
  })

  it('logout', () => {
    cy.login('e2e@test.com', 'password')
    cy.url().should('include', utils.url)
    cy.get('button[id="logout"]').click()
    cy.url().should('include', utils.url + 'login')
  })
})

describe('Register', () => {
  it('register invalid credentials', () => {
    cy.register('Tester', 'test@example.com', 'password', 'password123')
    cy.contains('not match').should('be.visible')
  })

  it('register valid credentials', () => {
    cy.register('Tester', utils.randomEmail(), 'password', 'password')
    cy.url().should('include', utils.url)
  })
})