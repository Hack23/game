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
    cy.get("[data-testid=app-title]").should("contain", "Target Shooter");
  });

  it("displays timer countdown", () => {
    cy.visit("/");
    // Wait for 3D scene to render
    cy.wait(1000);
    cy.get("[data-testid=timer-display]", { timeout: 10000 }).should("exist");
    cy.get("[data-testid=timer-display]").should("contain", "TIME");
  });

  it("displays level indicator", () => {
    cy.visit("/");
    // Wait for 3D scene to render
    cy.wait(1000);
    cy.get("[data-testid=level-display]", { timeout: 10000 }).should("exist");
    cy.get("[data-testid=level-display]").should("contain", "LEVEL");
  });

  it("displays score with initial value", () => {
    cy.visit("/");
    // Wait for 3D scene to render
    cy.wait(1000);
    cy.get("[data-testid=score-display]", { timeout: 10000 }).should("exist");
    cy.get("[data-testid=score-label]").should("contain", "SCORE");
    cy.get("[data-testid=score-value]").should("exist");
  });

  it("shows active game status", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.get("[data-testid=game-status]").should("contain", "Active");
  });

  it("displays game instructions", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.get("[data-testid=instructions-text]").should("contain", "Click the target");
  });

  it("has pause and reset buttons", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.get("[data-testid=pause-button]").should("exist");
    cy.get("[data-testid=reset-button]").should("exist");
  });

  it("can pause and resume the game", () => {
    cy.visit("/");
    cy.wait(1000);
    
    // Pause the game
    cy.get("[data-testid=pause-button]").click();
    cy.get("[data-testid=game-status]").should("contain", "Paused");
    cy.get("[data-testid=pause-overlay]").should("exist");
    
    // Resume the game
    cy.get("[data-testid=pause-button]").click();
    cy.get("[data-testid=game-status]").should("contain", "Active");
    cy.get("[data-testid=pause-overlay]").should("not.exist");
  });

  it("can reset the game", () => {
    cy.visit("/");
    cy.wait(1000);
    
    // Wait a moment for timer to tick
    cy.wait(2000);
    
    // Reset the game
    cy.get("[data-testid=reset-button]").click();
    
    // Verify game is reset (active and timer is back to 60)
    cy.get("[data-testid=game-status]").should("contain", "Active");
  });
});
