// Isme hum validate karenge:
// - Attendee ID empty na ho.
// - Event ID empty na ho.
// - Check-in request valid ho.
// - Duplicate check-in ko handle karne ke liye operation interface ho.


export interface CheckInInput {
    attendeeId: string;
    eventId: string;
    organizerId: string;
}

export interface CheckInResult {
    success: boolean;
    message: string;
}

export interface CheckInService {
    performCheckIn(input: CheckInInput): Promise<CheckInResult>;
}

// Basic input validation
export function validateCheckIn(
    input: CheckInInput
): CheckInResult {
    if (!input.attendeeId.trim()) {
        return {
            success: false,
            message: "Attendee ID is required",
        };
    }

    if (!input.eventId.trim()) {
        return {
            success: false,
            message: "Event ID is required",
        };
    }

    if (!input.organizerId.trim()) {
        return {
            success: false,
            message: "Organizer ID is required",
        };
    }

    return {
        success: true,
        message: "Validation successful",
    };
}

// Main check-in function
export async function checkInAttendee(
    input: CheckInInput,
    service: CheckInService
): Promise<CheckInResult> {
    const validation = validateCheckIn(input);

    if (!validation.success) {
        return validation;
    }

    return service.performCheckIn(input);
}
