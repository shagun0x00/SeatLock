# Identity Module

**Owner:** Member 1

## Responsibility
- Authentication
- Login and logout
- Session management
- Current user retrieval
- Role-based access control
- User management
- Resource authorization

## Internal Structure
- actions/: Server actions
- services/: Business logic
- repositories/: Database access
- validators/: Input validation
- types/: Module-specific types
- public.ts: Public module exports

## Dependencies
- Shared contracts
- Shared database client
- Zod
- JOSE
- bcryptjs

## Integration
Other modules must use the exported interfaces in public.ts rather than importing internal implementation files.