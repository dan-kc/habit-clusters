import { happyStub } from "cypress/support/commands"
const invalidEmail = "adfasf"
const invalidPassword = "gdbf"

describe("Login route", () => {
  beforeEach(() => {
    // Arrange
    cy.visit("/")
  })

  it("should show input fields", () => {
    // Assert
    cy.get('input[name="email"]').should("exist")
      .get('input[name="password"]').should("exist")
  })

  it("link to /signup", () => {
    // Assert
    cy.get('a[href="/"]').should("exist")
  })

  it("requires email", () => {
    // Act
    cy.get('input[name="password"]').click()
      .get('input[name="password"]').type(happyStub.password, {
        force: true,
      })
      .get('button[data-cy="login"]').click()

      .get('input[name="email"]:invalid').should("have.length", 1)
  })

  it("requires valid email", () => {
    // Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(invalidEmail)
      .get('input[name="password"]').click()
      .get('input[name="password"]').type(happyStub.password, {
        force: true,
      })

      // Assert
      .get('input[name="email"]:invalid').should("have.length", 1)
  })

  it("requires password", () => {
    //Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email)
      .get('button[data-cy="login"]').click()

      //Assert
      .get('input[name="password"]:invalid').should("have.length", 1)
  })

  it("should show error if unable to log in", () => {
    // Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email)
      .get('input[name="password"]').click()
      .get('input[name="password"]').type(invalidPassword)
      .get('button[data-cy="login"]').click()

      // Assert
      .get('p[data-cy="errorMessage"]').should("exist")
  })

  it("should redirect to dashboard after successful login", () => {
    // Act
    cy.login(happyStub.email, happyStub.password)

      // Assert
      .location("pathname").should("eq", "/dashboard")
  })
})
