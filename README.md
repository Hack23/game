# Game Template

A clean, minimal template for building games with React, TypeScript, and Vite.

## Features

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Modern React with hooks
- 🔷 **TypeScript** - Strict typing with latest standards
- 🧪 **Vitest** - Fast unit testing with coverage
- 🌲 **Cypress** - Reliable E2E testing
- 📦 **ESLint** - Code linting with TypeScript rules
- 🔄 **GitHub Actions** - Automated testing and reporting

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e:open
```

## Testing

### Unit Tests

- Uses Vitest with jsdom environment
- Configured for React Testing Library
- Coverage reports generated automatically
- Run with: `npm run test`

### E2E Tests

- Uses Cypress for end-to-end testing
- Starts dev server automatically
- Screenshots and videos on failure
- Run with: `npm run test:e2e`

### CI/CD

- GitHub Actions workflow included
- Runs on push/PR to main branch
- Parallel test execution
- Artifact uploads for reports

## Project Structure

```
src/
├── test/           # Test setup and utilities
├── App.tsx         # Main application component
├── App.test.tsx    # Unit tests for App
├── main.tsx        # Application entry point
└── index.css       # Global styles

cypress/
├── e2e/           # End-to-end test specs
└── support/       # Cypress support files

.github/
└── workflows/     # GitHub Actions workflows
```

## Development Guidelines

- **Strict TypeScript** - Enable all strict options
- **Test Coverage** - Aim for 80%+ coverage
- **Component Testing** - Test critical user flows
- **Type Safety** - Avoid `any`, use explicit types

## Building Your Game

This template provides a solid foundation for game development:

1. Replace the counter example with your game logic
2. Add game-specific components in `src/components/`
3. Create game state management (Context API, Zustand, etc.)
4. Add unit tests for game logic
5. Create E2E tests for game flows
6. Deploy using the included GitHub Actions

Happy gaming! 🎮
