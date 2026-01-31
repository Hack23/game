---
name: testing-strategy
description: Comprehensive testing with Vitest, Cypress, and React Testing Library targeting 80%+ coverage with Three.js component testing
license: MIT
---

# Testing Strategy Skill

## Context
This skill applies when:
- Writing unit tests for React components and game logic
- Creating E2E tests for game flows and user interactions
- Testing Three.js 3D components and animations
- Mocking dependencies and external services
- Measuring and improving code coverage
- Testing security controls and input validation
- Debugging failing tests

## Rules

1. **Target 80%+ Coverage**: Aim for minimum 80% code coverage across lines, branches, functions, and statements
2. **Test Pyramid**: Most tests should be unit tests, fewer integration tests, fewest E2E tests
3. **Test Behavior, Not Implementation**: Test what the code does, not how it does it
4. **Use AAA Pattern**: Arrange (setup), Act (execute), Assert (verify) in all tests
5. **Mock External Dependencies**: Mock APIs, file system, timers, and external services with proper TypeScript types
6. **Test Error Cases**: Always test both success and failure paths
7. **Test Edge Cases**: Test boundary conditions, empty inputs, null/undefined, and extreme values
8. **Use React Testing Library**: Query by accessibility roles and text, not implementation details
9. **Test Three.js Logic, Not Rendering**: Test game logic and state changes, mock Three.js renderer
10. **Isolate Tests**: Each test should be independent and not rely on other tests' state
11. **Use Descriptive Names**: Test names should explain what is being tested and expected outcome
12. **Test Security Controls**: Verify input validation, sanitization, authentication, and authorization
13. **Avoid Test Duplication**: Don't test the same logic in multiple places
14. **Keep Tests Fast**: Unit tests should run in milliseconds, E2E tests in seconds
15. **CI/CD Integration**: All tests must pass before merge - no exceptions

## Examples

### ✅ Good Pattern: Component Unit Test with RTL

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from './Player';
import type { PlayerProps } from './Player.types';

describe('Player Component', () => {
  const defaultProps: PlayerProps = {
    initialPosition: [0, 0, 0],
    speed: 5,
    health: 100
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should render with initial position', () => {
    // Arrange
    const props = { ...defaultProps };
    
    // Act
    render(<Player {...props} />);
    
    // Assert
    const player = screen.getByRole('player');
    expect(player).toBeInTheDocument();
    expect(player).toHaveAttribute('data-position', '0,0,0');
  });
  
  it('should call onCollision when collision detected', async () => {
    // Arrange
    const onCollision = vi.fn();
    const props = { ...defaultProps, onCollision };
    render(<Player {...props} />);
    
    // Act
    fireEvent.click(screen.getByRole('player'));
    
    // Assert
    await waitFor(() => {
      expect(onCollision).toHaveBeenCalledTimes(1);
      expect(onCollision).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'collision' })
      );
    });
  });
  
  it('should change color when health is low', () => {
    // Arrange & Act
    const { rerender } = render(<Player {...defaultProps} health={100} />);
    expect(screen.getByRole('player')).toHaveStyle({ color: 'green' });
    
    // Act - update health
    rerender(<Player {...defaultProps} health={20} />);
    
    // Assert
    expect(screen.getByRole('player')).toHaveStyle({ color: 'red' });
  });
  
  it('should throw error for invalid position', () => {
    // Arrange
    const invalidProps = {
      ...defaultProps,
      initialPosition: [NaN, 0, 0] as [number, number, number]
    };
    
    // Act & Assert
    expect(() => render(<Player {...invalidProps} />)).toThrow(
      'Invalid position coordinates'
    );
  });
});
```

### ✅ Good Pattern: Testing Three.js Game Logic

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamePhysics } from './useGamePhysics';
import * as THREE from 'three';

// Mock Three.js to avoid WebGL context
vi.mock('three', async () => {
  const actual = await vi.importActual<typeof THREE>('three');
  return {
    ...actual,
    WebGLRenderer: vi.fn(() => ({
      render: vi.fn(),
      setSize: vi.fn(),
      dispose: vi.fn()
    }))
  };
});

describe('useGamePhysics Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with zero velocity', () => {
    // Arrange & Act
    const { result } = renderHook(() => useGamePhysics());
    
    // Assert
    expect(result.current.velocity).toEqual({ x: 0, y: 0, z: 0 });
  });
  
  it('should apply gravity over time', () => {
    // Arrange
    const { result } = renderHook(() => useGamePhysics({
      gravity: -9.8,
      mass: 1
    }));
    
    // Act - simulate 0.1 second
    act(() => {
      result.current.update(0.1);
    });
    
    // Assert
    expect(result.current.velocity.y).toBeCloseTo(-0.98, 2);
  });
  
  it('should detect collision with ground', () => {
    // Arrange
    const { result } = renderHook(() => useGamePhysics());
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    
    // Act
    act(() => {
      result.current.setPosition(0, -1, 0); // Below ground
    });
    
    const collision = result.current.checkCollision(groundPlane);
    
    // Assert
    expect(collision).toBe(true);
    expect(result.current.position.y).toBeCloseTo(0, 2); // Should be corrected to ground level
  });
  
  it('should handle boundary conditions', () => {
    // Arrange
    const { result } = renderHook(() => useGamePhysics({
      bounds: { min: -10, max: 10 }
    }));
    
    // Act - try to move outside bounds
    act(() => {
      result.current.setPosition(15, 0, 0);
    });
    
    // Assert
    expect(result.current.position.x).toBe(10); // Clamped to max
  });
});
```

### ✅ Good Pattern: Mocking with TypeScript

```typescript
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { AuthService } from './AuthService';
import type { UserCredentials, AuthResult } from './types';

// Create typed mock
const mockFetch = vi.fn() as Mock<
  Parameters<typeof fetch>,
  ReturnType<typeof fetch>
>;

// Mock global fetch
global.fetch = mockFetch;

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
  });
  
  it('should authenticate user with valid credentials', async () => {
    // Arrange
    const credentials: UserCredentials = {
      username: 'testuser',
      password: 'SecureP@ssw0rd!'
    };
    
    const mockResponse: AuthResult = {
      success: true,
      token: 'jwt_token_here',
      userId: '12345'
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);
    
    // Act
    const result = await authService.login(credentials);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(credentials)
      })
    );
  });
  
  it('should handle authentication failure', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' })
    } as Response);
    
    // Act & Assert
    await expect(
      authService.login({ username: 'bad', password: 'wrong' })
    ).rejects.toThrow('Authentication failed');
  });
  
  it('should handle network errors', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    // Act & Assert
    await expect(
      authService.login({ username: 'user', password: 'pass' })
    ).rejects.toThrow('Network error');
  });
});
```

### ✅ Good Pattern: Security Testing

```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeInput, validatePassword, escapeHtml } from './security';

describe('Security Controls', () => {
  describe('sanitizeInput', () => {
    it('should remove XSS attack vectors', () => {
      // Arrange
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="evil.com"></iframe>'
      ];
      
      // Act & Assert
      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
      });
    });
    
    it('should handle SQL injection attempts', () => {
      // Arrange
      const sqlInjections = [
        "'; DROP TABLE users;--",
        "1' OR '1'='1",
        "admin'--"
      ];
      
      // Act & Assert
      sqlInjections.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain("'");
        expect(sanitized).not.toContain('--');
        expect(sanitized).not.toContain('DROP');
      });
    });
  });
  
  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const strongPasswords = [
        'MySecureP@ssw0rd!',
        'C0mpl3x!Pass',
        'Str0ng#Pass123'
      ];
      
      strongPasswords.forEach(password => {
        expect(validatePassword(password).isValid).toBe(true);
      });
    });
    
    it('should reject weak passwords', () => {
      const weakPasswords = [
        'short',           // Too short
        'password123',     // No special chars
        'PASSWORD123!',    // No lowercase
        'password!',       // No numbers
        'Pass1!'           // Too short
      ];
      
      weakPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors).toBeDefined();
      });
    });
  });
});
```

### ✅ Good Pattern: E2E Test with Cypress

```typescript
describe('Game Flow E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should complete full game session', () => {
    // Start game
    cy.get('[data-testid="start-button"]').click();
    cy.get('[data-testid="game-canvas"]').should('be.visible');
    
    // Wait for game to load
    cy.get('[data-testid="loading"]').should('not.exist');
    
    // Interact with player
    cy.get('[data-testid="game-canvas"]')
      .trigger('pointerdown', { clientX: 100, clientY: 100 })
      .trigger('pointerup');
    
    // Verify score updates
    cy.get('[data-testid="score"]').should('contain', '10');
    
    // Complete level
    cy.get('[data-testid="level-complete"]', { timeout: 10000 })
      .should('be.visible');
    
    // Verify final stats
    cy.get('[data-testid="final-score"]').should('exist');
    cy.get('[data-testid="play-again"]').should('be.visible');
  });
  
  it('should handle game over scenario', () => {
    cy.get('[data-testid="start-button"]').click();
    
    // Simulate player losing all health
    cy.window().then((win) => {
      // Access game state via window (for testing only)
      (win as any).gameState.setHealth(0);
    });
    
    // Verify game over screen
    cy.get('[data-testid="game-over"]').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.enabled');
  });
});
```

### ❌ Bad Pattern: Testing Implementation Details

```typescript
// Bad: Testing internal state instead of behavior
it('should update internal counter', () => {
  const { result } = renderHook(() => useGameState());
  
  // Don't test private state
  expect(result.current._internalCounter).toBe(0); // Bad!
  
  // Test behavior instead
  expect(result.current.score).toBe(0); // Good!
});
```

### ❌ Bad Pattern: No Type Safety in Mocks

```typescript
// Bad: Untyped mocks lose TypeScript benefits
const mockFn = vi.fn(); // No type information!

mockFn.mockReturnValue('string'); // Should return AuthResult, but no error!

// Good: Typed mocks
const mockFn = vi.fn<[UserCredentials], Promise<AuthResult>>();
```

### ❌ Bad Pattern: Testing Multiple Things

```typescript
// Bad: Testing multiple unrelated behaviors
it('should handle user interactions and API calls', () => {
  // Testing too much in one test
  render(<Component />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Clicked')).toBeInTheDocument();
  
  // Also testing API call in same test
  expect(mockApi).toHaveBeenCalled();
  
  // Also testing navigation
  expect(mockNavigate).toHaveBeenCalledWith('/next');
});
```

### ❌ Bad Pattern: Brittle Selectors

```typescript
// Bad: Using implementation details for queries
const element = screen.getByClassName('player-component'); // Bad!
const button = screen.getByTagName('button'); // Bad!

// Good: Using accessible queries
const element = screen.getByRole('player'); // Good!
const button = screen.getByRole('button', { name: /start game/i }); // Good!
```

## References

### Documentation
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress](https://www.cypress.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

### Best Practices
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)

### Tools
- [Vitest UI](https://vitest.dev/guide/ui.html)
- [Cypress Studio](https://docs.cypress.io/guides/references/cypress-studio)
- [Istanbul Coverage](https://istanbul.js.org/)

## Remember

- **Coverage is a Tool, Not a Goal**: 80% coverage doesn't mean quality tests - test behavior, not lines
- **Test Behavior, Not Implementation**: Tests should survive refactoring - query by role/text, not class/id
- **Mock External Dependencies**: Isolate unit tests by mocking APIs, timers, and Three.js renderer
- **AAA Pattern**: Every test should Arrange, Act, Assert - makes tests clear and maintainable
- **Test Error Paths**: Success cases are easy - error handling is where bugs hide
- **Fast Tests**: Unit tests in milliseconds, E2E tests in seconds - slow tests won't be run
- **Type Your Mocks**: Use TypeScript generics for type-safe mocks and better IDE support
- **Security Testing**: Test input validation, sanitization, authentication, authorization
- **Independent Tests**: Each test should set up its own data and clean up after itself
- **Descriptive Names**: Test names should explain what's tested and expected outcome
- **CI/CD Integration**: All tests must pass before merge - no "temporarily disabled" tests
- **Test Pyramid**: More unit tests, fewer integration tests, fewest E2E tests
- **Debug Tools**: Use Vitest UI, Cypress Studio, and browser DevTools for debugging
- **Documentation**: Document complex test setups and mocking strategies
- **Continuous Improvement**: Regularly review test coverage and quality
