import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().optional(),
    venue: z.string().trim().min(1).max(255),
    starts_at: z.string().min(1),
    ends_at: z.string().min(1),
    booking_closes_at: z.string().min(1),
  })
  .refine(
    (data) =>
      !Number.isNaN(new Date(data.starts_at).getTime()) &&
      !Number.isNaN(new Date(data.ends_at).getTime()) &&
      !Number.isNaN(new Date(data.booking_closes_at).getTime()),
    {
      message: "Enter valid event dates.",
    }
  )
  .refine(
    (data) => new Date(data.starts_at) > new Date(),
    {
      message: "The event start must be in the future.",
      path: ["starts_at"],
    }
  )
  .refine(
    (data) => new Date(data.ends_at) > new Date(),
    {
      message: "The event end must be in the future.",
      path: ["ends_at"],
    }
  )
  .refine(
    (data) => new Date(data.starts_at) < new Date(data.ends_at),
    {
      message: "The event end must be after its start.",
      path: ["ends_at"],
    }
  )
  .refine(
    (data) => new Date(data.booking_closes_at) > new Date(),
    {
      message: "Booking closure must be in the future.",
      path: ["booking_closes_at"],
    }
  )
  .refine(
    (data) =>
      new Date(data.booking_closes_at) <= new Date(data.starts_at),
    {
      message: "Booking must close before the event starts.",
      path: ["booking_closes_at"],
    }
  );

export type CreateEventFormInput = z.infer<typeof createEventSchema>;