/// <reference types="cypress" />
// ***********************************************

const MOCK_HAPPY_EMAIL = Cypress.env("MOCK_HAPPY_EMAIL")
const MOCK_HAPPY_PASSWORD = Cypress.env("MOCK_HAPPY_PASSWORD")

export const happyStub = {
  email: MOCK_HAPPY_EMAIL,
  password: MOCK_HAPPY_PASSWORD,
  confirm_password: MOCK_HAPPY_PASSWORD
};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<any>;
      deleteAllClusters(): Chainable<any>;
      createPlainCluster(): Chainable<any>;
      populateClusterForm(): Chainable<any>;
      resetClusterForm(): Chainable<any>;
      clickAddClusterButton(): Chainable<any>;
      submitClusterForm(): Chainable<any>;
      toggleClusterOpen(): Chainable<any>;
      toggleHabitComplete(): Chainable<any>;
      clickEditClusterButton(): Chainable<any>;
    }
  }
}

Cypress.Commands.add('login', (email, password) => {
  cy.visit("/");
  cy.get('input[name="email"]').click();
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').click();
  cy.get('input[name="password"]').type(password);
  cy.get('button[data-cy="login"]').click();
})

Cypress.Commands.add('deleteAllClusters', () => {
  cy
    .get('article[data-cy="cluster"]')
    .should('have.length.gte', 0)
    .then((els) => {
      if (els.length === 0) return
      cy
        .wrap(els)
        .each((el) => {
          cy
            .wrap(el)
            .find('button[data-cy="open_cluster"]')
            .click()
            .parents('article[data-cy="cluster"]')
            .find('button[data-cy="edit_cluster"]')
            .click()
            .then(() => {
              cy
                .get('button[value="delete_cluster"]')
                .click()
            })
        });
    })
})

Cypress.Commands.add('createPlainCluster', () => {
  cy.clickAddClusterButton()
  cy.submitClusterForm()
})

Cypress.Commands.add('populateClusterForm', () => {
  cy.get('input[name="cluster_name"]').click().type("Clusty")
  cy.get('input[name="start_time"]').click().type("01:22")
  cy.get('input[name="end_time"]').click().type("22:10")
  cy.get('button[data-cy="add_habit"]').click()
  cy.get('input[name="new_habit_name"]').click().type("Habity")
})

Cypress.Commands.add('resetClusterForm', () => {
  cy.get('input[name="cluster_name"]').clear()
  cy.get('input[name="start_time"]').click().type("00:00")
  cy.get('input[name="end_time"]').click().type("23:59")
  cy.get('button[data-cy="delete_habit"]').click()
})

Cypress.Commands.add('clickAddClusterButton', () => cy.get('button[data-cy="add_cluster"]').click())
Cypress.Commands.add('clickEditClusterButton', () => cy.get('button[data-cy="edit_cluster"]').click())
Cypress.Commands.add('submitClusterForm', () => cy.get('button[value="update_cluster"]').click())
Cypress.Commands.add('toggleClusterOpen', () => cy.get('button[data-cy="open_cluster"]').click())
Cypress.Commands.add('toggleHabitComplete', () => cy.get('button[value="toggle_is_complete"]').click())
