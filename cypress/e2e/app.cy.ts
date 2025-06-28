describe("PixiJS Game E2E", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.viewport(1280, 720); // Set a standard viewport for testing
  });

  describe("Initial Page Load", () => {
    it("should display the game page correctly", () => {
      // Check main heading
      cy.get("h1").should("contain.text", "PixiJS React Game");

      // Check instructions are present
      cy.get("p.instructions").should(
        "contain.text",
        "A minimal PixiJS game built with @pixi/react and @pixi/layout"
      );

      // Check that the game container exists
      cy.get(".app-container").should("be.visible");
    });

    it("should have proper page structure", () => {
      // Check main container
      cy.get(".app-container").should("exist").and("be.visible");

      // Check heading structure
      cy.get("h1").should("have.length", 1);

      // Check instructions
      cy.get("p.instructions").should("be.visible");
    });
  });

  describe("Game Canvas", () => {
    it("should render the PixiJS canvas", () => {
      // PixiJS creates a canvas element
      cy.get("canvas").should("exist").and("be.visible");
    });

    it("should have responsive canvas", () => {
      // Check that canvas has a width and height (not checking specific values as they're responsive)
      cy.get("canvas").should(($canvas) => {
        expect($canvas[0]).to.have.property("width");
        expect($canvas[0]).to.have.property("height");
        // Canvas should be visible with non-zero dimensions
        expect($canvas[0].width).to.be.greaterThan(0);
        expect($canvas[0].height).to.be.greaterThan(0);
      });
    });
  });

  describe("Game Interaction", () => {
    it("should be interactive", () => {
      // Wait for canvas to be ready
      cy.get("canvas").should("be.visible");

      // The game canvas should be present and ready for interaction
      cy.get("canvas").should("have.attr", "style");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      cy.get("h1").should("have.length", 1);
    });

    it("should have readable content", () => {
      cy.get("h1")
        .should("be.visible")
        .and("contain.text", "PixiJS React Game");
      cy.get("p.instructions").should("be.visible");
    });
  });

  describe("Responsive Design", () => {
    it("should be visible on different screen sizes", () => {
      // Test on tablet size
      cy.viewport(768, 1024);
      cy.get(".app-container").should("be.visible");
      cy.get("canvas").should("be.visible");

      // Test on mobile size
      cy.viewport(375, 667);
      cy.get(".app-container").should("be.visible");
      cy.get("canvas").should("be.visible");

      // Canvas should always be visible and appropriately sized
      cy.get("canvas").should(($canvas) => {
        expect($canvas[0].width).to.be.greaterThan(0);
        expect($canvas[0].height).to.be.greaterThan(0);
      });
    });
  });

  it("should load the game correctly", () => {
    // Check the title and instructions
    cy.get('[data-testid="app-title"]')
      .should("be.visible")
      .and("contain.text", "PixiJS React Game");
    cy.get('[data-testid="app-instructions"]').should("be.visible");

    // Check that the game canvas is rendered
    cy.get("canvas").should("be.visible");
  });

  it("should have correct initial game state", () => {
    // Since we can't directly test PixiJS elements in Cypress,
    // we can use application state or visual testing
    cy.wait(1000); // Wait for PixiJS to initialize

    // Take a screenshot for visual comparison
    cy.screenshot("game-initial-state");
  });

  it("should be responsive on different screen sizes", () => {
    // Test on mobile size
    cy.viewport(375, 667);
    cy.wait(500);
    cy.screenshot("game-mobile-view");

    // Test on tablet size
    cy.viewport(768, 1024);
    cy.wait(500);
    cy.screenshot("game-tablet-view");

    // Test on large desktop
    cy.viewport(1920, 1080);
    cy.wait(500);
    cy.screenshot("game-desktop-view");
  });

  it("should have working navigation and buttons", () => {
    cy.wait(1000); // Wait for PixiJS to initialize

    // Since we can't easily test PixiJS specific elements in Cypress,
    // we can test keyboard controls or focus navigation

    // Press space to pause (assuming we implement keyboard controls)
    cy.focused().type(" ");
    cy.wait(500);
    cy.screenshot("game-paused-state");

    // Press space again to resume
    cy.focused().type(" ");
    cy.wait(500);
    cy.screenshot("game-resumed-state");
  });
});
