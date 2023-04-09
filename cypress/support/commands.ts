/// <reference types="cypress" />
// ***********************************************

const MOCK_HAPPY_EMAIL = Cypress.env('MOCK_HAPPY_EMAIL');
const MOCK_HAPPY_PASSWORD = Cypress.env('MOCK_HAPPY_PASSWORD');

export const happyStub = {
  email: MOCK_HAPPY_EMAIL,
  password: MOCK_HAPPY_PASSWORD,
  confirm_password: MOCK_HAPPY_PASSWORD,
};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<any>;
      deleteAllClusters(): Chainable<any>;
      createPlainCluster(): Chainable<any>;
      populateClusterForm(): Chainable<any>;
      resetClusterForm(): Chainable<any>;
    }
  }
}

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/')
    .get('input[name="email"]').click()
    .get('input[name="email"]').type(email)
    .get('input[name="password"]').click()
    .get('input[name="password"]').type(password)
    .get('button[data-cy="login"]').click();
});

Cypress.Commands.add('deleteAllClusters', () => {
  cy.get('article[data-cy="cluster"]')
    .should('have.length.gte', 0)
    .then((els) => {
      if (els.length === 0) return;
      cy.wrap(els).each((el) => {
        cy.wrap(el)
          .find('button[data-cy="open_cluster"]')
          .click()
          .parents('article[data-cy="cluster"]')
          .find('button[data-cy="edit_cluster"]')
          .click()
          .then(() => {
            cy.get('button[value="delete_cluster"]').click();
          });
      });
    });
});

Cypress.Commands.add('createPlainCluster', () => {
  cy.get('button[data-cy="add_cluster"]').click()
    .get('button[value="create_cluster"]').click()
});

Cypress.Commands.add('populateClusterForm', () => {
  cy.get('input[name="cluster_name"]').click().type('Clusty')
    .get('input[name="start_time"]').click().type('01:22')
    .get('input[name="end_time"]').click().type('22:10')
    .get('button[data-cy="add_habit"]').click()
    .get('input[name="new_habit_name"]').click().type('Habity');
});

Cypress.Commands.add('resetClusterForm', () => {
  cy.get('input[name="cluster_name"]').clear()
    .get('input[name="start_time"]').click().type('00:00')
    .get('input[name="end_time"]').click().type('23:59')
    .get('button[data-cy="delete_habit"]').click();
});
