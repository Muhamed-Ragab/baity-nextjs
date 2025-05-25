const BASE_URL = 'http://localhost:3000';

describe('auth', () => {
  it('register', () => {
    cy.visit(`${BASE_URL}/auth/register`);

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('123456aA');
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="phone"]').type('01032586489');

    cy.intercept('POST', '**/auth/register').as('register');
    cy.get('form').submit().wait('@register');

    cy.get('div > p').then(($p) => {
      if (!$p.text().match(/User already exists/i)) {
        cy.url().should('eq', `${BASE_URL}/`);
        return;
      }

      cy.visit(`${BASE_URL}/auth/login`);
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('123456aA');

      cy.intercept('POST', '**/auth/login').as('login');
      cy.get('form').submit().wait('@login');
      cy.url().should('eq', `${BASE_URL}/`);
    });
  });

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('NEXT_REDIRECT')) {
      return false;
    }
    throw err;
  });
});
