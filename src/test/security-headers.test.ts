import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Security Headers in Built HTML", () => {
  const htmlPath: string = path.resolve(__dirname, "../../index.html");
  const htmlContent: string = fs.readFileSync(htmlPath, "utf-8");

  it("should include Content Security Policy meta tag", () => {
    expect(htmlContent).toContain('http-equiv="Content-Security-Policy"');
    expect(htmlContent).toContain("default-src 'self'");
    expect(htmlContent).toContain("script-src 'self'");
    expect(htmlContent).toContain("frame-ancestors 'none'");
  });

  it("should include X-Frame-Options meta tag", () => {
    expect(htmlContent).toContain('http-equiv="X-Frame-Options"');
    expect(htmlContent).toContain('content="DENY"');
  });

  it("should include X-Content-Type-Options meta tag", () => {
    expect(htmlContent).toContain('http-equiv="X-Content-Type-Options"');
    expect(htmlContent).toContain('content="nosniff"');
  });

  it("should include referrer policy meta tag", () => {
    expect(htmlContent).toContain('name="referrer"');
    expect(htmlContent).toContain("strict-origin-when-cross-origin");
  });

  it("should include X-XSS-Protection meta tag", () => {
    expect(htmlContent).toContain('http-equiv="X-XSS-Protection"');
    expect(htmlContent).toContain('content="1; mode=block"');
  });

  it("should include Permissions Policy meta tag", () => {
    expect(htmlContent).toContain('http-equiv="Permissions-Policy"');
    expect(htmlContent).toContain("geolocation=()");
  });

  it("should include Cross-Origin-Opener-Policy meta tag", () => {
    expect(htmlContent).toContain('http-equiv="Cross-Origin-Opener-Policy"');
    expect(htmlContent).toContain('content="same-origin"');
  });

  it("should include Cross-Origin-Resource-Policy meta tag", () => {
    expect(htmlContent).toContain('http-equiv="Cross-Origin-Resource-Policy"');
    expect(htmlContent).toContain('content="same-origin"');
  });

  it("should allow unsafe-inline for styles (required for React)", () => {
    expect(htmlContent).toContain("style-src 'self' 'unsafe-inline'");
  });

  it("should allow blob: for images and media (required for Three.js)", () => {
    expect(htmlContent).toContain("img-src 'self' data: blob:");
    expect(htmlContent).toContain("media-src 'self' blob:");
  });

  it("should allow worker-src for Web Workers", () => {
    expect(htmlContent).toContain("worker-src 'self' blob:");
  });
});
