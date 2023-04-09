import { happyStub } from 'cypress/support/commands';
import { getMonthName, padNumber } from '~/components/Calendar';

describe('Dashboard route', () => {

  beforeEach(() => {
    cy.login(happyStub.email, happyStub.password);
  });

  afterEach(() => {
    cy.deleteAllClusters(); // Assumes all clusters are closed
  });

  it('should show logo', () => {
    // Assert
    cy.get('h1').should('contain', 'Habit Clusters');
  });

  it('should show coming soon panels', () => {
    // Assert
    cy.get('div[data-cy="coming_soon_panel"]').should('have.length', 3);
  });

  it('should show add cluster button', () => {
    // Assert
    cy.get('button[data-cy="add_cluster"]').should('exist');
  });

  it('should show cluster modal when you click add button', () => {
    // Act
    cy.get('button[data-cy="add_cluster"]').click()

      // Assert
      .get('div[data-cy="cluster_dialog"]')
      .should('exist');
  });

  it('should add cluster on form submission', () => {
    // Act
    cy.get('button[data-cy="add_cluster"]').click()
      .get('button[value="create_cluster"]').click()

      // Assert
      .get('article[data-cy="cluster"]')
      .should('exist');
  });

  it('should show cluster details after creation', () => {
    // Act
    cy.get('button[data-cy="add_cluster"]').click()
      .populateClusterForm()
      .get('button[value="create_cluster"]').click()
      .get('button[data-cy="open_cluster"]').click()

      // Assert
      .get('article[data-cy="cluster"]')
      .find('h2')
      .should('contain.text', 'Clusty')
      .get('p[data-cy="availability_window"]')
      .should('contain.text', '01:22', '22:10')
      .get('button[value="toggle_completion_on"]')
      .should('contain.text', 'Habity')

      // After effect
      .get('button[data-cy="open_cluster"]').click();
  });

  it('should show cluster details after edit', () => {
    // Act
    cy.createPlainCluster()
      .get('button[data-cy="open_cluster"]').click()
      .get('button[data-cy="edit_cluster"]').click()
      .populateClusterForm()
      .get('button[value="update_cluster"]').click()
      .wait(400)

      // Assert
      .get('article[data-cy="cluster"]')
      .find('h2')
      .should('contain.text', 'Clusty')
      .get('p[data-cy="availability_window"]')
      .should('contain.text', '01:22', '22:10')
      .get('button[value="toggle_completion_on"]')
      .should('contain.text', 'Habity')

      // After effect
      .get('button[data-cy="open_cluster"]').click();
  });

  it('should remove cluster after deletion', () => {
    // Act
    cy.createPlainCluster()
      .get('button[data-cy="open_cluster"]').click()
      .get('button[data-cy="edit_cluster"]').click()
      .get('button[value="update_cluster"]').click()
      .get('button[value="delete_cluster"]')
      .click()
      .wait(1500)

      // Assert
      .get('article[data-cy="cluster"]')
      .should('not.exist');
  });

  it('should toggle habit after button click', () => {
    // Act
    cy.createPlainCluster()
      .get('button[data-cy="open_cluster"]').click()
      .get('button[data-cy="edit_cluster"]').click()
      .populateClusterForm()
      .get('button[value="update_cluster"]').click()
      .wait(400)
      .get('button[value="toggle_completion_on"]').click()
      .click()
      .wait(400)

      // Assert
      .get('button[value="toggle_completion_off"]')
      .should('exist')

      // After effect
      .get('button[data-cy="open_cluster"]').click();
  });

  it('should show edits made to cluster', () => {
    // Act
    cy.createPlainCluster()
      .get('button[data-cy="open_cluster"]').click()
      .get('button[data-cy="edit_cluster"]').click()
      .populateClusterForm()
      .get('button[value="update_cluster"]').click()
      .wait(2000)
      .get('button[data-cy="edit_cluster"]').click()
      .resetClusterForm()
      .get('button[value="update_cluster"]').click()
      .wait(2000)

      // Assert
      .get('article[data-cy="cluster"]')
      .find('h2')
      .should('not.contain', 'Clusty')
      .get('p[data-cy="availability_window"]')
      .should('contain.text', '00:00', '23:59')
      .get('button[value="toggle_completion_on"]')
      .should('not.exist')

      // After effect
      .get('button[data-cy="open_cluster"]').click();
  });

  it("should show date in calendar month picker", () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const monthName = getMonthName(currentDate);
    const year = currentDate.slice(0, 4);
    cy.get('h2').should('contain.text', monthName)
      .get('h2').should('contain.text', year)
  })

  it("should highlight currently selected date in calendar", () => {
    const currentDate = new Date()
    const day = currentDate.getDate()
    cy.get('button[data-cy="selected"]').should('contain.text', day)
  })

  it("should show different habit info after navigating to a different day", () => {
    // Act
    cy.createPlainCluster()
      .get('button[data-cy="open_cluster"]').click()
      .get('button[data-cy="edit_cluster"]').click()
      .populateClusterForm()
      .get('button[value="update_cluster"]').click()
      .wait(400)
      .get('button[value="toggle_completion_on"]').click()
      .click()
      .wait(400)
      .get('button[aria-label="go-to-next-month"]').click()
      .wait(400)

      // Assert
      .get('button[value="toggle_completion_off"]')
      .should('not.exist')

      // After effect
      .get('button[data-cy="open_cluster"]').click();
  })
});
