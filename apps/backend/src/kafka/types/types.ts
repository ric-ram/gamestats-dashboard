import { EventDto } from '../../events/dto/event.dto';

export function isEventMessage(obj: any): obj is EventDto {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const candidate = obj as Record<string, unknown>;

	if (typeof candidate.type !== 'string') {
		return false;
	}

	if (typeof candidate.payload !== 'object' || candidate.payload === null) {
		return false;
	}

	return true;
}
