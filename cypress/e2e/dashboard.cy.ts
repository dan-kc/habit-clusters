import { happyStub } from "cypress/support/commands";

describe("Dashboard route", () => {

    beforeEach(() => {
        cy.login(happyStub.email, happyStub.password);
    });

    afterEach(() => {
        cy.deleteAllClusters() // Assumes all clusters are closed
    })

    it("should show logo", () => {
        // Assert
        cy.get("h1").should("contain", "Habit Clusters");
    });
    
    it("should show coming soon panels", () => {
        // Assert
        cy.get('div[data-cy="coming_soon_panel"]').should("have.length", 3);
    });
    
    it("should show add cluster button", () => {
        // Assert
        cy.get('button[data-cy="add_cluster"]').should("exist");
    });
    
    it("should show cluster modal on button click", () => {
        // Act
        cy.clickAddClusterButton()
    
            // Assert
            .get('div[data-cy="cluster_dialog"]').should("exist")
    });
    
    it("should add cluster on form submission", () => {
        // Act
        cy.clickAddClusterButton()
            .submitClusterForm()
    
            // Assert
            .get('article[data-cy="cluster"]').should("exist")
    });
    
    it("should show cluster details after creation", () => {
        // Act
        cy.clickAddClusterButton()
            .populateClusterForm()
            .submitClusterForm()
            .toggleClusterOpen()
    
            // Assert
            .get('article[data-cy="cluster"]').find("h2").should("contain.text", "Clusty")
            .get('p[data-cy="availability_window"]').should("contain.text", "01:22", "22:10")
            .get('button[value="toggle_is_complete"]').should("contain.text", "Habity")
    
            // After effect
            .toggleClusterOpen()
    });

    it("should show cluster details after edit", () => {
        // Act
        cy.createPlainCluster()
            .toggleClusterOpen()
            .clickEditClusterButton()
            .populateClusterForm()
            .submitClusterForm().wait(400)

            // Assert
            .get('article[data-cy="cluster"]').find("h2").should("contain.text", "Clusty")
            .get('p[data-cy="availability_window"]').should("contain.text", "01:22", "22:10")
            .get('button[value="toggle_is_complete"]').should("contain.text", "Habity")

            // After effect
            .toggleClusterOpen()
    });

    it("should remove cluster after deletion", () => {
        // Act
        cy.createPlainCluster()
            .toggleClusterOpen()
            .clickEditClusterButton()
            .submitClusterForm()
            .get('button[value="delete_cluster"]').click().wait(1500)

            // Assert
            .get('article[data-cy="cluster"]').should("not.exist")
    });

    it("should toggle habit after button click", () => {
        // Act
        cy.createPlainCluster()
            .toggleClusterOpen()
            .clickEditClusterButton()
            .populateClusterForm()
            .submitClusterForm().wait(400)
            .toggleHabitComplete().click().wait(400)

            // Assert
            .get('input[value="true"]').should('exist')

            // After effect
            .toggleClusterOpen()
    });

    it("should show edits made to cluster", () => {
        // Act
        cy.createPlainCluster()
            .toggleClusterOpen()
            .clickEditClusterButton()
            .populateClusterForm()
            .submitClusterForm().wait(2000)
            .clickEditClusterButton()
            .resetClusterForm()
            .submitClusterForm().wait(2000)

            // Assert
            .get('article[data-cy="cluster"]').find("h2").should("not.contain", "Clusty")
            .get('p[data-cy="availability_window"]').should("contain.text", "00:00", "23:59")
            .get('button[value="toggle_is_complete"]').should("not.exist")

            // After effect
            .toggleClusterOpen()
    })
})
