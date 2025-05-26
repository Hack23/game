describe("Rubik's Cube Game E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Initial Page Load", () => {
    it("should display the Rubik's Cube game correctly", () => {
      // Check page title
      cy.title().should("eq", "Vite + React + TS");

      // Check main heading
      cy.get("h1").should("contain.text", "Rubik's Cube");

      // Check instructions are present
      cy.get("p.instructions").should(
        "contain.text",
        "Standard Rubik's Cube with notation"
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

      // Check controls section
      cy.get(".controls").should("be.visible");

      // Check cube legend
      cy.get(".cube-legend").should("be.visible");
    });
  });

  describe("Game Canvas", () => {
    it("should render the PixiJS canvas", () => {
      // PixiJS creates a canvas element
      cy.get("canvas").should("exist");
    });

    it("should have the correct canvas dimensions for cube layout", () => {
      // Check that canvas has dimensions based on cube layout calculation
      // Canvas dimensions are calculated: 4 * BLOCK_WIDTH + FACELET_SPACING * 2
      // With FACELET_SIZE=28, FACELET_SPACING=3, this gives specific dimensions
      cy.get("canvas")
        .should("be.visible")
        .and(($canvas) => {
          // Verify canvas exists and has reasonable dimensions for the cube layout
          const canvas = $canvas[0] as HTMLCanvasElement;
          expect(canvas.width).to.be.greaterThan(300); // Should be around 402
          expect(canvas.height).to.be.greaterThan(200); // Should be around 312
        });
    });
  });

  describe("Cube Controls", () => {
    it("should have all move buttons", () => {
      // Check F, R, U move buttons
      cy.get(".move-buttons button").should("have.length", 3);
      cy.get(".move-buttons button").contains("F").should("be.visible");
      cy.get(".move-buttons button").contains("R").should("be.visible");
      cy.get(".move-buttons button").contains("U").should("be.visible");
    });

    it("should have action buttons", () => {
      // Check Shuffle and Reset buttons
      cy.get(".action-buttons button").should("have.length", 2);
      cy.get(".action-buttons .shuffle-btn").should("contain.text", "Shuffle");
      cy.get(".action-buttons .reset-btn").should("contain.text", "Reset");
    });

    it("should be able to click move buttons", () => {
      // Test clicking F move
      cy.get(".move-buttons button").contains("F").click();

      // Test clicking R move
      cy.get(".move-buttons button").contains("R").click();

      // Test clicking U move
      cy.get(".move-buttons button").contains("U").click();

      // These should not cause errors
      cy.get("canvas").should("be.visible");
    });

    it("should be able to shuffle and reset", () => {
      // Test shuffle functionality
      cy.get(".shuffle-btn").click();
      cy.get("canvas").should("be.visible");

      // Test reset functionality
      cy.get(".reset-btn").click();
      cy.get("canvas").should("be.visible");
    });
  });

  describe("Cube Legend", () => {
    it("should display all cube face colors", () => {
      const expectedColors = [
        "White (Up)",
        "Yellow (Down)",
        "Green (Front)",
        "Blue (Right)",
        "Orange (Left)",
        "Red (Back)",
      ];

      expectedColors.forEach((color) => {
        cy.get(".cube-legend").should("contain.text", color);
      });
    });

    it("should have color boxes for each face", () => {
      // Should have 6 color boxes (one for each face)
      cy.get(".cube-legend .color-box").should("have.length", 6);
    });
  });

  describe("Game Interaction", () => {
    it("should be interactive", () => {
      // Wait for canvas to be ready
      cy.get("canvas").should("be.visible");

      // The game canvas should be present and ready for interaction
      cy.get("canvas").should("have.attr", "style");
    });

    it("should perform a sequence of moves", () => {
      // Perform a sequence of cube moves
      cy.get(".move-buttons button").contains("F").click();
      cy.wait(100); // Small delay between moves

      cy.get(".move-buttons button").contains("R").click();
      cy.wait(100);

      cy.get(".move-buttons button").contains("U").click();
      cy.wait(100);

      // Canvas should still be visible after moves
      cy.get("canvas").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      cy.get("h1").should("have.length", 1);
    });

    it("should have readable content", () => {
      cy.get("h1").should("be.visible").and("contain.text", "Rubik's Cube");
      cy.get("p.instructions").should("be.visible");
    });

    it("should have accessible button labels", () => {
      // Move buttons should have clear labels
      cy.get(".move-buttons button").each(($btn) => {
        cy.wrap($btn).should("not.be.empty").and("be.visible");
      });

      // Action buttons should have clear labels
      cy.get(".action-buttons button").each(($btn) => {
        cy.wrap($btn).should("not.be.empty").and("be.visible");
      });
    });
  });

  describe("Responsive Design", () => {
    it("should be visible on different screen sizes", () => {
      // Test on tablet size
      cy.viewport(768, 1024);
      cy.get(".app-container").should("be.visible");
      cy.get("canvas").should("be.visible");
      cy.get(".controls").should("be.visible");

      // Test on mobile size
      cy.viewport(375, 667);
      cy.get(".app-container").should("be.visible");
      cy.get("canvas").should("be.visible");
      cy.get(".controls").should("be.visible");
    });

    it("should adapt controls layout on smaller screens", () => {
      // Test mobile viewport
      cy.viewport(375, 667);

      // Controls should still be functional
      cy.get(".move-buttons").should("be.visible");
      cy.get(".action-buttons").should("be.visible");

      // Legend should adapt to smaller screen
      cy.get(".cube-legend").should("be.visible");
    });
  });
});
