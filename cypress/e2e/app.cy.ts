describe("Game App E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the main page correctly", () => {
    // Check page title
    cy.title().should("eq", "Vite + React + TS");

    // Check main heading
    cy.get("h1").should("contain.text", "Vite + React");

    // Check logos are present
    cy.get('img[alt="Vite logo"]').should("be.visible");
    cy.get('img[alt="React logo"]').should("be.visible");

    // Check initial counter state
    cy.get("button").should("contain.text", "count is 0");
  });

  it("should increment counter when clicked", () => {
    // Click the counter button
    cy.get("button").contains("count is 0").click();

    // Verify counter incremented
    cy.get("button").should("contain.text", "count is 1");
  });

  it("visits the app", () => {
    cy.visit("/");
    cy.contains("Vite + React");
    cy.get("button").should("contain", "count is 0");
    cy.get("button").click();
    cy.get("button").should("contain", "count is 1");
  });
});
