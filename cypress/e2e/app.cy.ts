describe("PixiJS Game E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Initial Page Load", () => {
    it("should display the game page correctly", () => {
      // Check page title
      cy.title().should("eq", "Vite + React + TS");

      // Check main heading
      cy.get("h1").should("contain.text", "PixiJS React Game");

      // Check instructions are present
      cy.get("p.instructions").should(
        "contain.text",
        "A minimal PixiJS game built with @pixi/react"
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
      cy.get("canvas").should("exist");
    });

    it("should have the correct canvas dimensions", () => {
      // Check that canvas has the expected dimensions (800x600)
      cy.get("canvas").should(($canvas) => {
        expect($canvas[0]).to.have.property("width", 800);
        expect($canvas[0]).to.have.property("height", 600);
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
    });
  });
});
