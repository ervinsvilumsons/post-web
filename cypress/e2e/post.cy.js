import { utils } from '../support/e2e'

describe('Post', () => {
    it('read post', () => {
        cy.login(utils.email, utils.password)

        cy.intercept('GET', utils.apiUrl + 'posts*').as('postRequest')

        cy.wait('@postRequest')
        cy.get('#readPost').first().click()
        cy.url().should('match', /\/posts\/\d+$/)
        cy.logout()
    })

    it('create post', () => {
        cy.intercept('POST', utils.apiUrl + 'user/post').as('createPostRequest')

        cy.login(utils.email, utils.password)
        cy.get('#userPage').click()
        cy.get('#createPost').click()
        cy.url().should('include', utils.url + 'posts/create')
        cy.get('#title').type('Test')
        cy.get('#content').type('Hello world!')
        cy.get('input[type="checkbox"]').first().click()
        cy.get('button[type="submit"]').click()
        cy.wait('@createPostRequest')
        cy.url().should('include', utils.url + 'posts/edit/')
        cy.logout()
    })

    it('edit post', () => {
        cy.intercept('GET', utils.apiUrl + 'posts*').as('postRequest')
        cy.intercept('PUT', utils.apiUrl + 'user/post/*').as('editPostRequest')

        cy.login(utils.email, utils.password)
        cy.get('#userPage').click()
        cy.get('#editPost').first().click()
        cy.url().should('include', utils.url + 'posts/edit/')
        cy.wait('@postRequest')
        cy.get('#title').type('Test 2')
        cy.get('button[type="submit"]').click()
        cy.wait('@editPostRequest')
        cy.logout()
    })

    it('delete post', () => {
        cy.intercept('DELETE', utils.apiUrl + 'user/post/*').as('deletePostRequest')

        cy.login(utils.email, utils.password)
        cy.get('#userPage').click()
        cy.get('#deletePost').first().click()
        cy.wait('@deletePostRequest')
        cy.logout()
    })
})
