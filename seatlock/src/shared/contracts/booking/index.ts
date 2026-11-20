
/* ============================================
   BOOKING STATUS CONTRACTS
============================================ */

export type BookingStatusContract =
  | "CONFIRMED"
  | "CANCELLED";

export type HoldStatusContract =
  | "ACTIVE"
  | "CONFIRMED"
  | "EXPIRED"
  | "CANCELLED";

export type SeatStatusContract =
  | "AVAILABLE"
  | "HELD"
  | "BOOKED"
  | "BLOCKED";

export type SeatCategoryContract =
  | "STANDARD"
  | "PREMIUM"
  | "RECLINER"
  | "ACCESSIBLE";

/* ============================================
   BOOKING CONTRACT
============================================ */

export interface BookingDto {
  id: string;
  userId: string;
  screeningId: string;
  holdId: string;
  seatIds: readonly string[];
  totalAmountMinor: number;
  currency: string;
  status: BookingStatusContract;
  createdAt: string;
  cancelledAt: string | null;
}

/* ============================================
   HOLD CONTRACT
============================================ */

export interface HoldDto {
  id: string;
  userId: string;
  screeningId: string;
  seatIds: readonly string[];
  createdAt: string;
  expiresAt: string;
  status: HoldStatusContract;
}

/* ============================================
   SEAT CONTRACT
============================================ */

export interface SeatDto {
  id: string;
  screeningId: string;
  row: string;
  number: string;
  category: SeatCategoryContract;
  priceMinor: number;
  currency: string;
  status: SeatStatusContract;
  holdId: string | null;
  bookingId: string | null;
}

/* ============================================
   REQUEST CONTRACTS
============================================ */

export interface HoldSeatsRequest {
  userId: string;
  screeningId: string;
  seatIds: readonly string[];
}

export interface ConfirmBookingRequest {
  userId: string;
  holdId: string;
}

export interface CancelBookingRequest {
  userId: string;
  bookingId: string;
}

export interface GetMyBookingsRequest {
  userId: string;
  status?: BookingStatusContract;
  page?: number;
  pageSize?: number;
}

export interface GetSeatMapRequest {
  screeningId: string;
}

export interface BlockSeatsRequest {
  screeningId: string;
  seatIds: readonly string[];
}

export interface UnblockSeatsRequest {
  screeningId: string;
  seatIds: readonly string[];
}

/* ============================================
   SEAT MAP RESPONSE
============================================ */

export interface SeatMapRowDto {
  row: string;
  seats: readonly SeatDto[];
}

export interface SeatMapResponse {
  screeningId: string;
  rows: readonly SeatMapRowDto[];
  totalSeats: number;
  availableSeats: number;
  heldSeats: number;
  bookedSeats: number;
  blockedSeats: number;
}

/* ============================================
   PAGINATION CONTRACT
============================================ */

export interface PaginationDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: readonly T[];
  pagination: PaginationDto;
}

/* ============================================
   OPERATION RESPONSE CONTRACTS
============================================ */

export interface HoldSeatsResponse {
  hold: HoldDto;
  seats: readonly SeatDto[];
}

export interface ConfirmBookingResponse {
  booking: BookingDto;
  seats: readonly SeatDto[];
}

export interface CancelBookingResponse {
  booking: BookingDto;
  seats: readonly SeatDto[];
}

export interface BlockSeatsResponse {
  screeningId: string;
  blockedSeats: readonly SeatDto[];
  blockedSeatCount: number;
}

export interface UnblockSeatsResponse {
  screeningId: string;
  availableSeats: readonly SeatDto[];
  unblockedSeatCount: number;
}

export interface GetMyBookingsResponse {
  bookings: readonly BookingDto[];
  pagination: PaginationDto;
}
