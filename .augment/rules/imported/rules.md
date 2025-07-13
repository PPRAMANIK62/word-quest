---
type: "always_apply"
---

# Word Quest - Augment Rules

## Tech Stack Requirements

### Core Technologies

- **React** - Use functional components with hooks
- **TypeScript** - Strict typing for all components and utilities
- **Tailwind CSS v4** - For all styling (no custom CSS files)
- **shadcn/ui** - Use exclusively for all UI components
- **React Router** - For client-side routing
- **TanStack Query** - For all data fetching, caching, and state management
- **Supabase** - Database and authentication backend

### Package Manager

- **pnpm** and **pnpm dlx** - Use exclusively for package management
- Never use npm, yarn, or bun or npx, bunx etc. unless absolutely necessary

### Code Quality & Linting

- **pnpm run lint:fix** - after every completed tasks ensure to run this command IMPORTANT.

- **ESLint** - Use @antfu/eslint-config with the following configuration:
  - TypeScript support enabled
  - Formatters enabled
  - Stylistic rules: 2-space indentation, semicolons, double quotes
  - Custom rules:
    - `ts/consistent-type-definitions`: Use `type` instead of `interface`
    - `no-console`: Warn on console usage
    - `node/no-process-env`: Error on direct process.env access (use env.ts)
    - `perfectionist/sort-imports`: Enforce sorted imports
    - `unicorn/filename-case`: Enforce kebab-case filenames (except README.md)

## UI/UX Guidelines

### Design Principles

- **Dark Mode First** - Default to dark theme, ensure all components support dark mode
- **Clean & Modern** - Minimalist design with proper spacing and typography
- **Mobile Responsive** - All components must work on mobile devices
- **Accessibility** - Follow WCAG guidelines, proper ARIA labels

### Component Standards

- Use shadcn/ui components exclusively for UI elements
- Customize shadcn components through Tailwind classes, not custom CSS
- Maintain consistent spacing using Tailwind's spacing scale
- Use semantic HTML elements where appropriate

## Code Organization

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── game/           # Game-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   ├── utils.ts        # General utilities
│   └── queries/        # TanStack Query hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles (minimal)
```

### Naming Conventions

- **Components**: PascalCase (e.g., `GameBoard.tsx`)
- **Files**: kebab-case for non-components (e.g., `game-logic.ts`)
- **Variables/Functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names

## Development Practices

### React Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo() for performance optimization when needed
- Prefer composition over inheritance
- Keep components small and focused (single responsibility)

### State Management

- Use TanStack Query for server state
- Use React's built-in state (useState, useReducer) for local component state
- Avoid prop drilling - use context when necessary
- Implement optimistic updates for better UX

### Data Fetching

- All API calls through TanStack Query
- Implement proper loading states
- Handle error states gracefully
- Use query invalidation for real-time updates
- Implement proper caching strategies

### TypeScript Guidelines

- Enable strict mode
- Define interfaces for all data structures
- Use proper typing for props and state
- Avoid `any` type - use `unknown` or proper types
- Implement proper error typing

## Supabase Integration

### Database Patterns

- Use Row Level Security (RLS) for all tables
- Implement proper foreign key relationships
- Use database functions for complex operations
- Follow PostgreSQL best practices

### Authentication

- Implement secure authentication flows
- Use Supabase Auth for user management
- Protect routes based on authentication state
- Handle session management properly

### Real-time Features

- Use Supabase real-time subscriptions for live updates
- Implement proper cleanup for subscriptions
- Handle connection states gracefully

## Performance Guidelines

### Optimization Strategies

- Implement code splitting with React.lazy()
- Use proper image optimization
- Minimize bundle size
- Implement proper caching strategies
- Use React DevTools Profiler for performance monitoring

### Loading States

- Show skeleton loaders for better perceived performance
- Implement progressive loading for large datasets
- Use suspense boundaries appropriately

## Security Considerations

### Client-Side Security

- Validate all user inputs
- Sanitize data before rendering
- Use environment variables for sensitive configuration
- Implement proper CORS policies
- Never expose sensitive keys in client code

### Supabase Security

- Use RLS policies for data access control
- Implement proper user authorization
- Validate data on the server side
- Use secure connection strings

## Error Handling

### Error Boundaries

- Implement error boundaries for graceful error handling
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI components

### API Error Handling

- Handle network errors gracefully
- Implement retry logic for failed requests
- Show appropriate error messages to users
- Log errors for monitoring

## Deployment & Environment

### Environment Configuration

- Use environment variables for configuration
- Separate development, staging, and production configs
- Never commit sensitive information
- Use proper environment validation

### Build Process

- Optimize build for production
- Implement proper asset optimization
- Use proper source maps for debugging
- Monitor bundle size

## Code Quality

### Linting & Formatting

- Use ESLint with strict rules
- Use Prettier for code formatting
- Implement pre-commit hooks
- Maintain consistent code style

### Code Review Guidelines

- Review for security vulnerabilities
- Check for performance implications
- Ensure proper TypeScript usage
- Verify accessibility compliance
- Test on multiple devices/browsers

## Documentation

### Code Documentation

- Document complex business logic
- Use JSDoc for function documentation
- Maintain up-to-date README
- Document API integrations

### Component Documentation

- Document component props and usage
- Provide examples for complex components
- Document accessibility features
- Maintain component library documentation
