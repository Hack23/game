describe("App E2E", () => {
  it("renders the app container", () => {
    cy.visit("/");
    cy.get("[data-testid=app-container]").should("exist");
  });

  it("renders the Three.js canvas container", () => {
    cy.visit("/");
    cy.get("[data-testid=threejs-canvas-container]").should("exist");
  });

  it("displays the correct title", () => {
    cy.visit("/");
    cy.get("[data-testid=app-title]").should("contain", "Three.js React Game");
  });
});
