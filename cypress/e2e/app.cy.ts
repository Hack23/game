describe("App E2E - UI and Basic Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    // Wait for game to fully initialize
    cy.get("[data-testid=app-container]").should("exist");
  });

  it("renders the app container", () => {
    cy.get("[data-testid=app-container]").should("exist");
  });

  it("renders the Three.js canvas container", () => {
    cy.get("[data-testid=threejs-canvas-container]").should("exist");
  });

  it("displays the correct title", () => {
    cy.get("[data-testid=app-title]").should("contain", "Target Shooter");
  });

  it("displays timer countdown", () => {
    cy.get("[data-testid=timer-display]").should("exist");
    cy.get("[data-testid=timer-display]").should("contain", "TIME");
    cy.get("[data-testid=timer-display]").should("contain", "60s");
  });

  it("displays level indicator", () => {
    cy.get("[data-testid=level-display]").should("exist");
    cy.get("[data-testid=level-display]").should("contain", "LEVEL");
    cy.get("[data-testid=level-display]").should("contain", "1");
  });

  it("displays score with initial value", () => {
    cy.get("[data-testid=score-display]").should("exist");
    cy.get("[data-testid=score-label]").should("contain", "SCORE");
    cy.get("[data-testid=score-value]").should("contain", "0");
  });

  it("shows active game status", () => {
    cy.get("[data-testid=game-status]").should("contain", "Active");
  });

  it("displays game instructions", () => {
    cy.get("[data-testid=instructions-text]").should("contain", "Click the target");
  });

  it("has pause and reset buttons", () => {
    cy.get("[data-testid=pause-button]").should("exist").and("be.visible");
    cy.get("[data-testid=reset-button]").should("exist").and("be.visible");
    cy.get("[data-testid=mute-button]").should("exist").and("be.visible");
  });

  it("can pause and resume the game", () => {
    // Pause the game
    cy.get("[data-testid=pause-button]").should("not.be.disabled").click();
    cy.get("[data-testid=game-status]").should("contain", "Paused");
    cy.get("[data-testid=pause-overlay]").should("exist").and("be.visible");
    cy.get("[data-testid=instructions-text]").should("contain", "paused");
    
    // Resume the game
    cy.get("[data-testid=pause-button]").click();
    cy.get("[data-testid=game-status]").should("contain", "Active");
    cy.get("[data-testid=pause-overlay]").should("not.exist");
    cy.get("[data-testid=instructions-text]").should("contain", "Click the target");
  });

  it("can reset the game", () => {
    // Wait a moment for timer to tick
    cy.wait(2000);
    
    // Verify timer has changed
    cy.get("[data-testid=timer-display]").should("not.contain", "60s");
    
    // Reset the game
    cy.get("[data-testid=reset-button]").click();
    
    // Verify game is reset (active and timer is back to 60)
    cy.get("[data-testid=game-status]").should("contain", "Active");
    cy.get("[data-testid=timer-display]").should("contain", "60s");
    cy.get("[data-testid=score-value]").should("contain", "0");
  });

  it("can toggle mute button", () => {
    // Check mute button exists and shows Mute
    cy.get("[data-testid=mute-button]").should("exist").and("be.visible");
    cy.get("[data-testid=mute-button]").should("contain", "Mute");
    
    // Audio status should be visible when unmuted
    cy.contains("Sound enabled").should("exist");
    
    // Click to mute
    cy.get("[data-testid=mute-button]").click();
    cy.get("[data-testid=mute-button]").should("contain", "Unmute");
    
    // Audio status should be hidden when muted
    cy.contains("Sound enabled").should("not.exist");
    
    // Click to unmute
    cy.get("[data-testid=mute-button]").click();
    cy.get("[data-testid=mute-button]").should("contain", "Mute");
    
    // Audio status should be visible again
    cy.contains("Sound enabled").should("exist");
  });

  it("can adjust volume with slider", () => {
    // Check volume slider exists
    cy.get("[data-testid=volume-slider]").should("exist").and("be.visible");
    
    // The slider should show 100% initially
    cy.contains("100%").should("exist");
    
    // Set volume to 50% - use invoke to set value then trigger input event
    cy.get("[data-testid=volume-slider]")
      .invoke("val", 0.5)
      .trigger("input");
    
    // Verify the volume display shows 50%
    cy.contains("50%").should("exist");
    
    // Set volume to 0%
    cy.get("[data-testid=volume-slider]")
      .invoke("val", 0)
      .trigger("input");
    
    cy.contains("0%").should("exist");
    
    // Set volume back to 75%
    cy.get("[data-testid=volume-slider]")
      .invoke("val", 0.75)
      .trigger("input");
    
    cy.contains("75%").should("exist");
  });

  it("should have a visible and interactive 3D target", () => {
    // Target should exist in the canvas
    cy.get("[data-testid=target-sphere]").should("exist");
    
    // Canvas should be visible
    cy.get("[data-testid=threejs-canvas-container]").should("be.visible");
  });

  it("should display instructions that change with game state", () => {
    // Active state instructions
    cy.get("[data-testid=instructions-text]")
      .should("be.visible")
      .and("contain", "Click the target");
    
    // Pause and check instructions change
    cy.get("[data-testid=pause-button]").click();
    cy.get("[data-testid=instructions-text]")
      .should("contain", "paused");
    
    // Resume
    cy.get("[data-testid=pause-button]").click();
    cy.get("[data-testid=instructions-text]")
      .should("contain", "Click the target");
  });
});
