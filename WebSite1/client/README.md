# React + TypeScript + Vite Client

This is a React client application built with TypeScript, Vite, and Jest for testing.

## Features

- ⚡️ **Vite** - Lightning fast development server and build tool
- ⚛️ **React 19** - Latest React with modern features
- 🎯 **TypeScript** - Type-safe development
- 🧪 **Jest** - Comprehensive testing framework
- 🎨 **React Testing Library** - Best practices for testing React components
- 📦 **Yarn** - Fast, reliable dependency management

## Getting Started

### Prerequisites

- Node.js 22.11.0 or higher
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install
```

### Development

```bash
# Start development server (runs on port 3000)
yarn dev
```

### Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Type checking
yarn lint
```

### Building

```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── App.tsx         # Main App component
│   ├── App.css         # App styles
│   ├── App.test.tsx    # App component tests
│   ├── main.tsx        # Application entry point
│   ├── setupTests.ts   # Jest setup file
│   └── vite-env.d.ts   # Vite type definitions
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── tsconfig.node.json  # TypeScript config for Node
└── jest.config.js      # Jest configuration
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn lint` - Run TypeScript type checking

## Testing

This project uses Jest and React Testing Library for testing. Test files should be named with `.test.tsx` or `.spec.tsx` suffix.

Example test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders button', () => {
  render(<App />);
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});
```

## Configuration Files

- **vite.config.ts** - Vite configuration with React plugin and path aliases
- **tsconfig.json** - TypeScript configuration for application code
- **tsconfig.node.json** - TypeScript configuration for build tools
- **jest.config.js** - Jest testing configuration

## API Proxy

The Vite development server is configured to proxy `/api` requests to `http://localhost:5000`. You can modify this in `vite.config.ts`.

## License

See LICENSE.txt in the parent directory.

