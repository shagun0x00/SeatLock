# SeatLock

A secure, server-rendered event seat-booking platform built with Next.js and PostgreSQL.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL

## Project Structure

The project is divided into three independent development modules.

| Member | Module | Responsibilities |
|---|---|---|
| Member 1 | Identity & Events | Authentication, authorization, event management |
| Member 2 | Booking | Seat management, holds, booking and concurrency |
| Member 3 | Audit & Operations | Audit logs, sharding, attendee management and check-in |

## Development Rules
1. Work only inside your assigned module.
2. Use shared contracts for communication between modules.
3. Do not modify another member's module without agreement.
4. Keep the application server-rendered.
5. PostgreSQL is the mandatory database.
6. Coordinate changes to shared files with the entire team.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Team
SeatLock Hackathon Team — 3 Members
