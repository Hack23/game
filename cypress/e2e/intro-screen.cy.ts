describe("IntroScreen Visual Test", () => {
  it("should show the intro screen with archetype selection", () => {
    cy.visit("/");
    
    // Wait for intro screen to load
    cy.get("[data-testid=intro-screen]", { timeout: 10000 }).should("exist");
    
    // Take screenshot of intro screen
    cy.screenshot("intro-screen-initial");
    
    // Select warrior archetype
    cy.get("[data-testid=archetype-warrior]").click();
    cy.screenshot("intro-screen-warrior-selected");
    
    // Select mage archetype
    cy.get("[data-testid=archetype-mage]").click();
    cy.screenshot("intro-screen-mage-selected");
    
    // Select ranger archetype
    cy.get("[data-testid=archetype-ranger]").click();
    cy.screenshot("intro-screen-ranger-selected");
    
    // Start game
    cy.get("[data-testid=start-button]").click();
    
    // Verify game screen appears
    cy.get("[data-testid=app-container]").should("exist");
    cy.get("[data-testid=threejs-canvas]").should("exist");
    cy.screenshot("game-screen-after-intro");
  });
});
