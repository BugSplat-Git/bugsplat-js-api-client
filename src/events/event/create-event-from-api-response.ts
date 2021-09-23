import { Event, EventResponseObject, EventStreamActionType } from "@events";

export function createEventFromApiResponse(event: EventResponseObject, type: EventStreamActionType): Event {
    return {
        id: parseInt(event.id),
        action: type,
        createdDate: new Date(event.timestamp),
        subject: {
            initials: getInitialsOrDefault(event),
            email: event.username,
        },
        message: event.message,
    };
}

function getInitialsOrDefault(event: EventResponseObject): string {
    if (event.firstName && event.lastName) {
        const firstInitial = event.firstName[0];
        const lastInitial = event.lastName[0];
        return `${firstInitial}${lastInitial}`;
    }

    return event.username?.substring(0, 2) ?? '';
}