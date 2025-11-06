describe("Game Visual Documentation", () => {
  beforeEach(() => {
    cy.visit("/");
    // Wait for game to fully load
    cy.get("[data-testid=app-container]").should("exist");
    cy.get("[data-testid=target-sphere]").should("exist");
  });

  it("captures initial game state", () => {
    // Wait for game to stabilize
    cy.wait(1000);
    
    // Take screenshot of initial state
    cy.screenshot("01-game-initial-state", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game with paused state", () => {
    // Pause the game
    cy.get("[data-testid=pause-button]").click();
    cy.wait(500);
    
    // Take screenshot of paused state
    cy.screenshot("02-game-paused", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game with volume control adjusted", () => {
    // Adjust volume to 50%
    cy.get("[data-testid=volume-slider]")
      .invoke("val", 0.5)
      .trigger("input");
    
    cy.wait(500);
    
    // Take screenshot with adjusted volume
    cy.screenshot("03-game-with-volume-at-50", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game with muted audio", () => {
    // Mute the audio
    cy.get("[data-testid=mute-button]").click();
    cy.wait(500);
    
    // Take screenshot with muted state
    cy.screenshot("04-game-muted", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game during active play", () => {
    // Click target a few times to show score and combo
    cy.get("[data-testid=target-sphere]").click({ force: true });
    cy.wait(300);
    cy.get("[data-testid=target-sphere]").click({ force: true });
    cy.wait(300);
    cy.get("[data-testid=target-sphere]").click({ force: true });
    cy.wait(500);
    
    // Take screenshot during gameplay
    cy.screenshot("05-game-active-with-score", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game after timer countdown", () => {
    // Wait for some time to pass
    cy.wait(3000);
    
    // Take screenshot with reduced timer
    cy.screenshot("06-game-with-timer-counting", {
      capture: "viewport",
      overwrite: true,
    });
  });
});
