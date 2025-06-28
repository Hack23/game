describe("App E2E", () => {
  it("renders the app container", () => {
    cy.visit("/");
    cy.get("[data-testid=app-container]").should("exist");
  });
});
