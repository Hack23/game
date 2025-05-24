describe("Game App E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Initial Page Load", () => {
    it("should display the main page correctly", () => {
      // Check page title
      cy.title().should("eq", "Vite + React + TS");

      // Check main heading
      cy.get("h1").should("contain.text", "Vite + React");

      // Check logos are present and visible
      cy.get('img[alt="Vite logo"]').should("be.visible");
      cy.get('img[alt="React logo"]').should("be.visible");

      // Check initial counter state
      cy.get("button").should("contain.text", "count is 0");
    });
  });

  describe("Counter Functionality", () => {
    it("should increment counter when clicked", () => {
      // Get initial counter button
      cy.get("button").contains("count is 0").as("counterButton");

      // Click the counter button
      cy.get("@counterButton").click();

      // Verify counter incremented
      cy.get("button").should("contain.text", "count is 1");
    });

    it("should increment counter multiple times", () => {
      const clickCount = 3;

      // Click multiple times
      for (let i = 0; i < clickCount; i++) {
        cy.get("button").click();
      }

      // Verify final count
      cy.get("button").should("contain.text", `count is ${clickCount}`);
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      cy.get("h1").should("have.length.at.least", 1);
    });

    it("should have interactive elements accessible", () => {
      cy.get("button").should("be.visible").and("not.be.disabled");
    });
  });
});
