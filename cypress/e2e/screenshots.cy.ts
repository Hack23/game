describe("Game Visual Documentation", () => {
  beforeEach(() => {
    cy.visit("/");
    // Wait for game to fully load - target-sphere check ensures game is ready
    cy.get("[data-testid=target-sphere]", { timeout: 10000 }).should("exist");
  });

  it("captures initial game state", () => {
    // Take screenshot of initial state
    cy.screenshot("01-game-initial-state", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game with paused state", () => {
    // Pause the game
    cy.get("[data-testid=pause-button]").click();
    cy.get("[data-testid=game-status]").should("contain", "Paused");
    
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
    
    // Verify volume changed
    cy.contains("50%").should("exist");
    
    // Take screenshot with adjusted volume
    cy.screenshot("03-game-with-volume-at-50", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game with muted audio", () => {
    // Mute the audio
    cy.get("[data-testid=mute-button]").click();
    cy.get("[data-testid=mute-button]").should("contain", "Unmute");
    
    // Take screenshot with muted state
    cy.screenshot("04-game-muted", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game during active play", () => {
    // Click target via test API to show score and combo
    cy.window().then((win) => {
      win.dispatchEvent(new CustomEvent('test:targetClick'));
      win.dispatchEvent(new CustomEvent('test:targetClick'));
      win.dispatchEvent(new CustomEvent('test:targetClick'));
    });
    
    // Verify score updated
    cy.get("[data-testid=score-value]").should("not.contain", "0");
    
    // Take screenshot during gameplay
    cy.screenshot("05-game-active-with-score", {
      capture: "viewport",
      overwrite: true,
    });
  });

  it("captures game after timer countdown", () => {
    // Wait for timer to tick down
    cy.wait(2000);
    cy.get("[data-testid=timer-display]").should("not.contain", "60s");
    
    // Take screenshot with reduced timer
    cy.screenshot("06-game-with-timer-counting", {
      capture: "viewport",
      overwrite: true,
    });
  });
});
