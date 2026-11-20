# Events Module

**Owner:** Member 1

## Responsibility
- Event creation
- Event editing
- Event publishing
- Event listing
- Event detail retrieval
- Organizer event ownership
- Optimistic locking

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

## Integration
Booking and Operations modules consume event information through the public event service interface.