describe("App E2E", () => {
  beforeEach(() => {
    cy.visit("/");
    // Wait for app to initialize
    cy.get("[data-testid=app-container]", { timeout: 10000 }).should(
      "be.visible"
    );
    // Wait for the game to load
    cy.get("[data-testid=pixi-application]", { timeout: 5000 }).should(
      "be.visible"
    );
  });

  it("displays the app header", () => {
    cy.get("[data-testid=app-title]").should("have.text", "PixiJS React Game");
  });

  it("displays the game title", () => {
    cy.get("[data-testid=game-title]").should("be.visible");
  });

  it("has a functional reset button", () => {
    // First, get the score to make sure we're starting at zero
    cy.contains("Score: 0").should("exist");

    // Click on the target a few times to increase score
    cy.get("[data-testid=target-circle]").click({ force: true });
    cy.get("[data-testid=target-circle]").click({ force: true });
    cy.get("[data-testid=target-circle]").click({ force: true });

    // Verify the score increased
    cy.contains("Score: 0").should("not.exist");

    // Now click reset
    cy.get("[data-testid=reset-button]").click({ force: true });

    // Verify score is reset to 0
    cy.contains("Score: 0").should("exist");
  });

  it("has a functional pause button", () => {
    // Verify game is initially in active state
    cy.get("[data-testid=game-status]").should("contain.text", "Active");

    // Click pause button
    cy.get("[data-testid=pause-button]").click({ force: true });

    // Verify game is paused
    cy.get("[data-testid=game-status]").should("contain.text", "Paused");

    // Try clicking on target - score should not increase when paused
    cy.get("[data-testid=score-display]").then(($score) => {
      const initialScore = $score.text();
      cy.get("[data-testid=target-circle]").click({ force: true });
      cy.get("[data-testid=score-display]").should("have.text", initialScore);
    });

    // Resume the game
    cy.get("[data-testid=pause-button]").click({ force: true });

    // Verify game is active again
    cy.get("[data-testid=game-status]").should("contain.text", "Active");

    // Now clicking should increase the score
    cy.get("[data-testid=score-display]").then(($score) => {
      const initialScore = $score.text();
      cy.get("[data-testid=target-circle]").click({ force: true });
      cy.get("[data-testid=score-display]").should(
        "not.have.text",
        initialScore
      );
    });
  });

  it("should have interactive target that increases score", () => {
    // Get initial score
    let initialScore: string;
    cy.get("[data-testid=score-display]").then(($score) => {
      initialScore = $score.text();

      // Click on the target
      cy.get("[data-testid=target-circle]").click({ force: true });

      // Verify score increased
      cy.get("[data-testid=score-display]").should(
        "not.have.text",
        initialScore
      );
    });

    // Click multiple times and verify position changes
    cy.get("[data-testid=target-circle]").then(($target) => {
      const initialPosition = $target.position();

      // Click the target
      cy.get("[data-testid=target-circle]").click({ force: true });

      // Get new position and verify it changed
      cy.get("[data-testid=target-circle]").then(($newTarget) => {
        const newPosition = $newTarget.position();
        // Position should change after clicking
        expect(newPosition).not.to.deep.equal(initialPosition);
      });
    });
  });
});
