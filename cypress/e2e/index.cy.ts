import { happyStub } from "cypress/support/commands"

const invalidEmail = "adfasf"
const invalidPassword = "gdbf"

describe("Index route", () => {
  beforeEach(() => {
    // Arrange
    cy.visit("/")
  })

  it("should show input fields", () => {
    // Assert
    cy.get('input[name="email"]').should("exist")
      .get('input[name="password"]').should("exist")
      .get('input[name="confirm_password"]').should("exist")
  })

  it("links to ", () => {
    // Assert
    cy.get('a[href="/"]').should("exist")
  })

  it("requires email", () => {
    // Act
    cy.get('input[type="checkbox"]').click()
      .get('input[name="password"]').click()
      .get('input[name="password"]').type(happyStub.password, { force: true })
      .get('input[name="confirm_password"]').click()
      .get('input[name="confirm_password"]').type(
        happyStub.password,
        {
          force: true,
        }
      )
      .get('button[type="submit"]').click()

      // Assert
      .get('input[name="email"]:invalid').should("have.length", 1)
  })

  it("requires valid email", () => {
    // Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(invalidEmail, { force: true })
      .get('input[name="password"]').click()
      .get('input[name="password"]').type(happyStub.password, { force: true })
      .get('input[name="confirm_password"]').click()
      .get('input[name="confirm_password"]').type(
        happyStub.password,
        {
          force: true,
        }
      )
      .get('input[type="checkbox"]').click()
      .get('button[type="submit"]').click()


      // Assert
      .get('input[name="email"]:invalid').should("have.length", 1)
  })

  it("requires password", () => {
    //Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email, {
        force: true,
      })
      .get('input[name="confirm_password"]').click()
      .get('input[name="confirm_password"]').type(
        happyStub.password,
        {
          force: true,
        }
      )
      .get('input[type="checkbox"]').click()
      .get('button[type="submit"]').click()

      //Assert
      .get('input[name="password"]:invalid').should("have.length", 1)
  })

  it("requires valid password", () => {
    // Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email, {
        force: true,
      })
      .get('input[name="password"]').click()
      .get('input[name="password"]').type("1234", { force: true })

      .get('input[name="confirm_password"]').click()
      .get('input[name="confirm_password"]').type(invalidPassword, {
        force: true,
      })
      .get('input[type="checkbox"]').click()
      .get('button[type="submit"]').click()

      // Assert
      .get("p").should(
        "contain.text",
        "Password must be 6 or more characters"
      )
  })

  it("requires confirm password", () => {
    //Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email, {
        force: true,
      })
      .get('input[name="password"]').click()
      .get('input[name="password"]').type(happyStub.password, {
        force: true,
      })
      .get('input[type="checkbox"]').click()
      .get('button[type="submit"]').click()

      //Assert
      .get('input[name="confirm_password"]:invalid').should(
        "have.length",
        1
      )
  })

  it("should produce error if password =/= confirm password", () => {
    // Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email, {
        force: true,
      })

      .get('input[name="password"]').click()
      .get('input[name="password"]').type("123456", { force: true })

      .get('input[name="confirm_password"]').click()
      .get('input[name="confirm_password"]').type("987654", {
        force: true,
      })

      .get('input[type="checkbox"]').click()
      .get('button[type="submit"]').click()

      // Assert
      .get("p").should("contain.text", "Passwords must match")
  })

  it("requires checkbox", () => {
    //Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email, {
        force: true,
      })
      .get('input[name="password"]').click()
      .get('input[name="password"]').type(happyStub.password, {
        force: true,
      })
      .get('input[name="confirm_password"]').click()
      .get('input[name="confirm_password"]').type(happyStub.password, {
        force: true,
      })
      .get('button[type="submit"]').click()

      //Assert
      .get('input[type="checkbox"]:invalid').should(
        "have.length",
        1
      )
  })

  it("should produce toast on successful sign up", () => {
    // Act
    cy.get('input[name="email"]').click()
      .get('input[name="email"]').type(happyStub.email, {
        force: true,
      })
      .get('input[name="password"]').click()
      .get('input[name="password"]').type(happyStub.password, {
        force: true,
      })
      .get('input[name="confirm_password"]').click()
      .get('input[name="confirm_password"]').type(
        happyStub.password,
        {
          force: true,
        }
      )
      .get('input[type="checkbox"]').click()
      .get('button[type="submit"]').click()

      // Assert
      .get('div[role="status"]').should("exist")
  })
})
