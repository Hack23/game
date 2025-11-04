describe("Game Screenshots", () => {
  it("takes screenshot of game with volume control", () => {
    cy.visit("/");
    
    // Wait for game to load
    cy.wait(2000);
    
    // Take screenshot
    cy.screenshot("game-initial-state", {
      capture: "viewport",
      overwrite: true,
    });
    
    // Adjust volume to 50%
    cy.get("[data-testid=volume-slider]")
      .invoke("val", "0.5")
      .trigger("change", { force: true });
    
    cy.wait(500);
    
    // Take screenshot with adjusted volume
    cy.screenshot("game-with-volume-at-50", {
      capture: "viewport",
      overwrite: true,
    });
  });
});
