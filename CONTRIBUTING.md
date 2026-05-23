# Contributing to bobanimelist

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/bobanimelist.git
   cd bobanimelist
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Development

- **Node.js** version 22.21.1 required (see `.nvmrc` or `engines` in `package.json`)
- **TypeScript** strict mode enabled
- **SCSS Modules** for styling (component-scoped)
- **Atomic Design** pattern: atoms → molecules → organisms → pages

## Running Tests

```bash
npm run test        # run all tests
npm run test:ui     # run with Vitest UI
npm run coverage    # generate coverage report
```

## Code Style

- Run `npm run lint` before committing
- Follow existing patterns in the codebase
- Use TypeScript strict typing (no `any` unless absolutely necessary)
- Component files: `PascalCase.tsx`
- Style files: `PascalCase.module.scss`

## Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```
2. Make your changes and commit with clear messages
3. Ensure linting passes: `npm run lint`
4. Ensure tests pass: `npm run test`
5. Push and open a PR against `main`

## Commit Convention

Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting (no logic change)
- `refactor:` code restructure
- `test:` adding/updating tests
- `chore:` tooling, deps, config

## Project Structure

```
src/
├── components/
│   ├── atoms/        # Basic UI elements
│   ├── molecules/    # Composed components
│   └── organisms/    # Complex sections
├── hooks/            # Custom React hooks
├── pages/            # Route pages
├── store/            # Redux store & slices
├── styles/           # Global SCSS & tokens
└── utils/            # Helper functions
```

## Questions?

Open an issue or reach out to the maintainer.
