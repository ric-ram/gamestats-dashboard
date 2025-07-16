import { EventDto } from '../../events/dto/event.dto';
import { isEventMessage } from './types';

describe('isEventMessage', () => {
	it('returns true for valid messages', () => {
		const valid: unknown = { type: 'foo', payload: { x: 1 } };
		expect(isEventMessage(valid)).toBe(true);
	});

	it('rejects non-object or null', () => {
		expect(isEventMessage(null)).toBe(false);
		expect(isEventMessage(123)).toBe(false);
	});

	it('rejects missing or wrong-type fields', () => {
		expect(isEventMessage({})).toBe(false);
		expect(isEventMessage({ type: 123, payload: {} })).toBe(false);
		expect(isEventMessage({ type: 't' })).toBe(false);
		expect(isEventMessage({ type: 't', payload: null })).toBe(false);
	});

	it('narrows type correctly', () => {
		const msg = { type: 'bar', payload: { y: 2 } };
		if (isEventMessage(msg)) {
			// within this block, TypeScript knows msg is EventDto
			const dto: EventDto = msg;
			expect(dto.type).toBe('bar');
			expect(dto.payload.y).toBe(2);
		} else {
			fail('should have passed guard');
		}
	});
});
